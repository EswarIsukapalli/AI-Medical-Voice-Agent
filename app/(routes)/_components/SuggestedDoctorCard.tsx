import React from 'react'
import Image from 'next/image'
import { doctorAgent } from './DoctorAgentCard'

type props={
    doctorAgent: doctorAgent
    setSelectedDoctor:any
    selectedDoctor?: doctorAgent
}
function SuggestedDoctorCard({doctorAgent, setSelectedDoctor, selectedDoctor}: props){
    return(
        <div className={`flex flex-col items-center border rounded-2xl shadow p-5 
                        hover:border-blue-500 cursor-pointer transition-colors
                        ${selectedDoctor?.id === doctorAgent?.id ? 'border-blue-500 bg-blue-50' : ''}`}
                        onClick={()=>setSelectedDoctor(doctorAgent)}>
            {doctorAgent.image && (
                <Image src={doctorAgent?.image}
                    alt={doctorAgent?.specialist || 'Doctor'}
                    width={70}
                    height={70}
                    className='w-[50px] h-[50px] rounded-full object-cover '
                />
            )}
            <h3 className='mt-2 text-lg font-semibold text-center'>{doctorAgent?.specialist || 'Doctor'}</h3>
            <p className='mt-1 text-sm text-gray-600 text-center line-clamp-2'>
                {doctorAgent?.description || 'Helps with medical consultation'}
            </p>
        </div>
    )
}

export default SuggestedDoctorCard