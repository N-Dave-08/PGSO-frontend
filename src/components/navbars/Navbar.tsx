import React from 'react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
    return (
        <div className='px-10 py-5 sticky top-2 z-50'>
            <div className="bg-neutral/70 shadow-lg py-2 px-2 flex items-center rounded-box w-2/3 m-auto justify-between">
                <Button variant={'ghost'} className="text-xl">PGSO</Button>
                <Button variant={'ghost'}>
                    Log in
                </Button>
            </div>
        </div>
    )
}
