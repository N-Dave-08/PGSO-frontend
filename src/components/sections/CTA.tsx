'use client'

import React from 'react'
import { setupImage } from '@/helpers/setup'
import Image from 'next/image'
import { Parallax, ParallaxProvider } from 'react-scroll-parallax'

export default function CTA() {
    return (
        <ParallaxProvider>
            <section className='flex flex-col items-center justify-center h-screen relative overflow-hidden'>
                <div className='text-center z-10 space-y-4'>
                    <h1 className='text-4xl font-bold'>Ready to make a Request?</h1>
                    <button className="btn btn-primary">Get Started</button>
                </div>
                <Parallax speed={-10} className='absolute inset-0 z-0'>
                <Image
                    className='opacity-40'
                    alt='worker'
                    fill
                    objectFit='cover'
                    src={`${setupImage}images/welding.png`}
                />
                </Parallax>
            </section>
        </ParallaxProvider>
    )
}
