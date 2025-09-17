"use client"

import React,{ useEffect, useState } from 'react'
import axios from 'axios'
import {useUser} from '@clerk/nextjs'
import { UserDetailsContext } from '@/UserDetailContext'


export type UsersDetail = {
  name: string;
  email: string;
  credits: number;
}

export default function Provider({ 
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const {user} = useUser();
    const [ userDetail,setUserDetail ] = useState<UsersDetail | null>(null)
    useEffect(() => {
     user&&CreateNewUser();
    },[user])

    const CreateNewUser= async()=>{
        const result = await axios.post('/api/users');
        console.log(result.data);
        setUserDetail(result.data as UsersDetail);
    }

  return (
    <div>
      <UserDetailsContext.Provider value={{userDetail,setUserDetail}}>
        {children}
      </UserDetailsContext.Provider>
    </div>
  )
}
