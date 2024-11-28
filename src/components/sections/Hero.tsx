import React from 'react'
import AnimatedBackground from '@/components/AnimatedBackground'
import { Button } from '@/components/ui/button'

export default function Hero() {
    return (
        <>
            <AnimatedBackground />
            <section className='relative z-10 flex flex-col justify-center items-center h-screen gap-6 -mt-[6.5rem] px-40'>
                <div className='text-center space-y-2'>
                    <h1 className='text-5xl font-bold'>Provincial General Service Office Request Management System</h1>
                    <p className='text-xl'>Optimizing Government Services for Faster Request Processing</p>
                </div>
                <Button>Get Started</Button>
            </section>
        </>

    )
}
