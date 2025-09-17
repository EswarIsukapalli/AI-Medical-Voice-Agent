import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'


const menuOptions=[
    {
        id: 1,
        name: 'Home',
        path: '/dashboard'
    },
    {
        id: 2,
        name: 'History',
        path: '/dashboard/history'
    },
    {
        id: 3,
        name: 'Pricing',
        path: '/dashboard/billing'
    },
    {
        id: 4,
        name: 'Profile',
        path: '/profile'
    }
]

function AppHeader(){
    return (
    <div className='flex items-center justify-between p-4 shadow px-10 md:px-20 lg:px-40'>
        <Link href="/">
            <Image src={'/logo.svg'} alt="Logo" width={45} height={20} />
        </Link>
        <div className='hidden md:flex gap-12 items-center'>
            {menuOptions.map((option, index) => (
                <div key={index}>
                    <Link href={option.path} className='hover:font-bold cursor-pointer transition-all'>
                        {option.name}
                    </Link>
                </div>
            ))}
        </div>
        <UserButton 
          afterSignOutUrl="/"
          userProfileUrl="/profile"
        />
    </div>
    )
}

export default AppHeader 