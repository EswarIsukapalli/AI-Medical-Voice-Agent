"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
  } from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Loader2 } from 'lucide-react'
import { doctorAgent } from './DoctorAgentCard'
import SuggestedDoctorCard from './SuggestedDoctorCard'
import { useRouter } from 'next/navigation'



function AddNewSessioDailog(){
  const router = useRouter();
  const [note,setNote] = useState<string>();
  const [loading,setLoading] = useState(false);
  const [suggestedDoctors,setSuggestedDoctors] = useState<doctorAgent[]>();
  const [selectedDoctor,setSelectedDoctor] = useState<doctorAgent>();

  const onClickNext = async () =>{
    setLoading(true);
    const result = await axios.post('/api/suggest-doctors',{
      notes:note
    })
    
    console.log('API Response:', result.data);
    console.log('Type of result.data:', typeof result.data);
    console.log('Is array:', Array.isArray(result.data));
    
    // Ensure result.data is an array
    let doctors;
    if (Array.isArray(result.data)) {
      doctors = result.data;
    } else if (result.data && typeof result.data === 'object') {
      // If it's an object, try to extract an array from it
      doctors = result.data.doctors || result.data.suggestions || [result.data];
    } else {
      doctors = [];
    }
    
    console.log('Processed doctors:', doctors);
    setSuggestedDoctors(doctors);
    setLoading(false);
  }

  const onStartConsultation=async()=>{
    setLoading(true);

    const result=await axios.post('/api/session-chat',{
      notes:note,
      selectedDoctor:selectedDoctor
    })
    console.log(result.data);
    if(result.data?.sessionId){
      console.log(result.data.sessionId);
      router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
    }
    setLoading(false);
  }



    return(
        <Dialog>
  <DialogTrigger asChild>
      <Button className='mt-3'>+ Start a Consultation</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Basic Details</DialogTitle>
      <DialogDescription asChild>
        {!suggestedDoctors?<div>
          <h2>Add Symptoms or Any Other Details</h2>
          <Textarea placeholder='Add Details Here....'
           className='h-[150px] mt-1'
           onChange={(e)=>setNote(e.target.value)}
           />
        </div>:
        <div>
          <h2>Select the doctor</h2>
        <div className='grid grid-cols-3 gap-5'>
          {/* // Suggested Doctors */}
          {suggestedDoctors?.map((doctor,index)=>(
            <SuggestedDoctorCard doctorAgent={doctor} key={index}
            setSelectedDoctor={()=>setSelectedDoctor(doctor)}
            selectedDoctor={selectedDoctor} />
          ))}
        </div>
        </div>}
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
          <Button variant={'outline'}>Cancel</Button>
      </DialogClose>

      {!suggestedDoctors? <Button disabled={!note || loading} onClick={onClickNext} >
              {loading&&<Loader2 className='animare-spin' />}
              Next {loading ? <Loader2 className='animate-spin'/> : <ArrowRight/>}</Button>
              : <Button disabled={loading || !selectedDoctor} onClick={()=> onStartConsultation()} >Start Consultation
              {loading ? <Loader2 className='animate-spin'/> : <ArrowRight/>}</Button>}
    </DialogFooter>
  </DialogContent>
</Dialog>   
    )
}

export default AddNewSessioDailog