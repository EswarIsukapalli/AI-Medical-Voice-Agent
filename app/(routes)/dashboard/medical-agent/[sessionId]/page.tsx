"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import { doctorAgent } from '@/app/(routes)/_components/DoctorAgentCard'
import { Circle, PhoneCall, PhoneOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Vapi from '@vapi-ai/web';



type sessionDetail={
    id:number,
    notes:string,
    sessionId:string,
    report:JSON,
    selectedDoctor:doctorAgent,
    createdOn:string,
    voiceId:string
}

type messages={
    role:string,
    text:string
}




export default function MedicalVoiceAgent() {
    const params = useParams()
    const sessionId = params.sessionId as string
    const [sessionDetail,setSessionDetail]=useState<sessionDetail>();
    const [callStrated,setCallStarted]=useState(false);
    const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);
    const [currentRole,setCurrentRole]=useState<string |null>('user');
    const [liveTranscript,setLiveTranscript] = useState<string>();
    const [messages,setMessages]=useState<messages[]>([]);


    useEffect(()=>{
        if (sessionId) {
            GetSessionDetails();
        }
    },[sessionId])

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_VAPI_API_KEY) {
            try {
                const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
                setVapiInstance(vapiInstance);
                console.log('Vapi instance created successfully');
                console.log('API Key length:', process.env.NEXT_PUBLIC_VAPI_API_KEY.length);
            } catch (error) {
                console.error('Failed to create Vapi instance:', error);
            }
        } else {
            console.error('VAPI_API_KEY not found in environment variables');
        }
    }, [])
    const GetSessionDetails=async()=>{
        try {
            console.log('Fetching session with ID:', sessionId);
            const result = await axios.get('/api/session-chat?sessionId='+sessionId);
            console.log('Session data:', result.data);
            setSessionDetail(result.data);
        } catch (error: any) {
            console.error('Error fetching session details:', error);
            if (error.response?.status === 404) {
                console.log('Session not found for ID:', sessionId);
            }
            // Handle error appropriately - maybe show a message to user
        }
    
    }

    const StartCall=async()=>{
        try {
            console.log('=== VAPI DEBUG INFO ===');
            console.log('API Key exists:', !!process.env.NEXT_PUBLIC_VAPI_API_KEY);
            console.log('API Key length:', process.env.NEXT_PUBLIC_VAPI_API_KEY?.length);
            console.log('Assistant ID:', process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID);
            console.log('Assistant ID length:', process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID?.length);
            console.log('Vapi instance exists:', !!vapiInstance);
            console.log('========================');
            
            if (!vapiInstance) {
                console.error('Vapi instance not initialized');
                alert('Vapi not initialized. Please refresh the page.');
                return;
            }
            
            if (!process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID) {
                console.error('Voice assistant ID is not set');
                alert('Voice assistant ID is not configured.');
                return;
            }

            // Request microphone permission with detailed audio settings
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        sampleRate: 44100
                    } 
                });
                console.log('Microphone permission granted');
                console.log('Audio stream:', stream);
                console.log('Audio tracks:', stream.getAudioTracks());
                
                // Test if microphone is actually working
                const audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                source.connect(analyser);
                
                console.log('Audio context created successfully');
            } catch (micError) {
                console.error('Microphone permission denied:', micError);
                alert('Microphone permission is required for voice calls. Please allow microphone access and try again.');
                return;
            }
            
            
            const VapiAgentConfig={
                name:'AI Medical Doctor Voice Agent',
                firstMessage:'Hi ther! I am your AI Medical Doctor Voice Agent. How can I help you today?',
                transcriber:{
                    provider:'assemblyai' as const,
                    language:'en' as const
                },
                voice:{
                    provider:'playht' as const,
                    voiceId:sessionDetail?.selectedDoctor?.voiceId
                },
                model:{
                    provider:'openai' as const,
                    model:'gpt-4' as const,
                    messages:[
                        {
                            role:'system',
                            content:sessionDetail?.selectedDoctor?.agentPrompt
                        },
                        {
                            role:'user',
                            content:'User Notes/Symptoms:'+sessionDetail?.notes+', Based on the user\'s symptoms, suggest 2-3 most relevant doctors from the provided list. Return only a JSON array of the selected doctor objects with all their properties (id, specialist, description, image, agentPrompt, voiceId, subscriptionRequired).'
                        }
                    ]
                }
            }
            console.log('Starting call with assistant ID:', process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID);
            vapiInstance.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID);
            
            vapiInstance.on('call-start', () => {
                console.log('Call started successfully');
                setCallStarted(true);
                setCurrentRole('assistant');
            });
            
            vapiInstance.on('call-end', () => {
                console.log('Call ended');
                setCallStarted(false);
                setCurrentRole('user');
            });
            
            vapiInstance.on('speech-start', () => {
                console.log('🎤 User started speaking - microphone is working!');
            });
            
            vapiInstance.on('speech-end', () => {
                console.log('🔇 User stopped speaking');
            });
            
            vapiInstance.on('volume-level', (volume) => {
                console.log('Volume level:', volume);
            });
            
            vapiInstance.on('message', (message) => {
                console.log('Message received:', message);
                if (message.type === 'transcript') {
                    const {role,transcriptType,transcript} = message;
                    console.log(`${message.role}: ${message.transcript}`);
                    if(transcriptType =='partial'){
                        setLiveTranscript(transcript);
                        setCurrentRole(role);
                    }
                    else if(transcriptType=='final'){
                        setMessages((prev) => [...(prev || []), {role:role,text:transcript}])
                        setLiveTranscript("");
                        setCurrentRole(null);
                    }
                }
            });
            
            vapiInstance.on('error', (error) => {
                console.error('Vapi error details:', {
                    error,
                    errorType: typeof error,
                    errorKeys: Object.keys(error || {}),
                    errorString: JSON.stringify(error)
                });
                setCallStarted(false);
            });


        } catch (error) {
            console.error('Error starting call:', error);
            setCallStarted(false);
        }
    }

    const EndCall = () => {
        try {
            if (vapiInstance) {
                vapiInstance.stop();
                setCallStarted(false);
                console.log('Call ended manually');
            }
        } catch (error) {
            console.error('Error ending call:', error);
        }
    }


    


    return (
        <div className='p-5 border rounded-3xl bg-secondary'>
            <div className='flex justify-between items-center' >
                <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'> 
                     <Circle className={`h-4 w-4 rounded-full ${callStrated? 'bg-green-500':'bg-red-500'}`} /> {callStrated?'Connected...':'Not Connected'} </h2>
                <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
            </div>

            {sessionDetail&&<div className='flex items-center flex-col mt-10'>
                <Image src={sessionDetail?.selectedDoctor?.image} alt={sessionDetail?.selectedDoctor?.specialist??''}
                width={120} height={120}
                className='h-[100px] w-[100px] object-cover rounded-full'
                />
                <h2 className='mt-1 text-lg'>{sessionDetail?.selectedDoctor?.specialist}</h2>
                <p className='text-sm text-gray-400'>AI Medical Voice Agent</p>

                <div className='mt-12 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72 '>
                    {messages?.slice(-4).map((msg:messages,index) => {
                        return <h2 className='text-gray-400 p-2' key={index}>{msg.role} : {msg.text} </h2>
                    })}
                    {liveTranscript&&liveTranscript?.length>0&& <h2 className='text-lg'>{currentRole} : {liveTranscript} </h2>}
                </div>
                    {!callStrated?<Button className='mt-20' onClick={StartCall}>
                        <PhoneCall /> Start Call</Button>
                        :<Button variant={'destructive'}  onClick={EndCall}> <PhoneOff /> Disconnect</Button>
                    }
                
            </div>}
        </div>
    )
}
