
import React from 'react'
import { capabilities } from '@/helpers/pageData'
import CapabilitiesCard from '@/components/cards/CapabilitiesCard'

export default function Capabilities() {
    return (
        <section className='relative z-10 flex flex-col justify-center items-center h-screen gap-4 px-40'>
            <h4 className='text-2xl font-semibold'>What can you do with PGSO Service Request System?</h4>
            <div className='grid grid-cols-3 gap-4'>
            {
                capabilities.map((capability, i) => (
                    <CapabilitiesCard 
                    key={i}
                    icon={React.createElement(capability.icon)}
                    title={capability.title}
                    description={capability.description}
                    />
                ))
            }
            </div>
        </section>
    )
}
