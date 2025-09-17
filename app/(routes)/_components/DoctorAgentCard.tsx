"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Loader2, Crown, Stethoscope, ArrowRight } from 'lucide-react'

export type doctorAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
    voiceId: string,
    subscriptionRequired?: boolean
}
type props={
    doctorAgent: doctorAgent
}

function DoctorAgentCard({doctorAgent}:props){
    const { user, isLoaded } = useUser();
    const isPremiumUser = Boolean(user?.publicMetadata?.subscriptionActive);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleStartConsultation = async () => {
        if (doctorAgent.subscriptionRequired && !isPremiumUser) {
            // Redirect to billing page for premium doctors
            router.push('/dashboard/billing');
            return;
        }

        setLoading(true);
        try {
            const result = await axios.post('/api/session-chat', {
                notes: `Starting consultation with ${doctorAgent.specialist}`,
                selectedDoctor: doctorAgent
            });
            
            if (result.data?.sessionId) {
                router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
            }
        } catch (error) {
            console.error('Error starting consultation:', error);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'>
            <div className='relative'>
                {doctorAgent.subscriptionRequired && !isPremiumUser && (
                    <Badge className='absolute m-2 right-0 flex items-center gap-1 bg-yellow-500 text-white hover:bg-yellow-500/90'>
                        <Crown className="w-3.5 h-3.5" /> Premium
                    </Badge>
                )}
                <Image 
                    src={doctorAgent.image} 
                    alt={doctorAgent.specialist} 
                    width={200} 
                    height={200}
                    className='w-full h-[240px] object-cover'
                />
            </div>
            <div className='p-4'>
                <h3 className='font-semibold text-lg text-gray-800 mb-2'>{doctorAgent.specialist}</h3>
                <p className='text-sm text-gray-600 line-clamp-2'>{doctorAgent.description}</p>
                <Button 
                    className='w-full mt-2 flex items-center justify-center gap-2' 
                    disabled={!isLoaded || (doctorAgent.subscriptionRequired && !isPremiumUser) || loading}
                    onClick={handleStartConsultation}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Starting...
                        </>
                    ) : (
                        <>
                            <Stethoscope className="w-4 h-4" />
                            Start Consultation
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default DoctorAgentCard