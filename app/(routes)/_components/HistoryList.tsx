"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import AddNewSessioDailog from './AddNewSessioDailog';
import axios from 'axios';
import HistoryTable from './HistoryTable';
import type { doctorAgent } from './DoctorAgentCard';

type sessionDetail = {
    id: number,
    sessionId: string,
    notes: string,
    selectedDoctor: doctorAgent,
    createdOn: string
}
    
function HistoryList(){
    const [historyList,setHistoryList] = useState<sessionDetail[]>([]);
    useEffect(()=>{
        GetHistoryList();
    },[]);
    const GetHistoryList=async()=>{
        const result = await axios.get('/api/session-chat?sessionId=all');
        console.log(result.data);
        setHistoryList(result.data);
    }




    return (
    <div className='mt-10'>
        {historyList.length==0?
        <div className='flex items-center flex-col justify-center p-7 border border-dashed rounded-2xl border-2'>
            <Image src={'/medical-assistance.png'} alt="Medical assistance" width={120} height={120} className="mx-auto" />
            <h2 className='font-bold text-xl mt-2'>No Recent Consultations</h2>
            <p className='text-left'>It looks like you haven't consulted with any doctors yet.</p>
            <AddNewSessioDailog/>
        </div>
        :<div>
            <HistoryTable historyList={historyList}/>
        </div>   
    }
    </div>
    )
}

export default HistoryList 