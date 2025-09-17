import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Billing(){
    return (
        <div className='px-6 py-4'>
            <h2 className='font-bold text-3xl mb-4'>Join Subscription</h2>
            <PricingTable />
        </div>
    )
}

export default Billing