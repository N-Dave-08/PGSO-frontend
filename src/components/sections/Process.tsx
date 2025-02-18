import React from 'react'
import { process } from '@/helpers/pageData'
import Image from 'next/image'
import { setupImage } from '@/helpers/setup'

export default function Process() {
    return (
        <section className='relative z-10 flex flex-col justify-center items-center h-screen gap-10 px-40'>
            <h4 className='text-2xl font-semibold'>How it Works</h4>
            <div className='flex w-full justify-center'>
                <ul className='bg-neutral p-8 rounded-lg steps steps-vertical'>
                    {
                        process.map((step, i) => (
                            <li key={i} className='step step-primary'>
                                <div className='text-start'>
                                    <p className='font-medium text-base'>{step.title}</p>
                                    <p className='font-normal'>{step.description}</p>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                <div className='relative w-1/3 h-full'>
                    <Image
                        alt='boy'
                        fill
                        objectFit='contain'
                        src={`${setupImage}images/boy-laptop.png`}
                    />
                </div>
            </div>
        </section>
    )
}
