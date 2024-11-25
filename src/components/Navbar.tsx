import React from 'react'
import { Menu } from 'lucide-react'

export default function Navbar() {
    return (
        <div className='px-10 py-5'>
            <div className="navbar bg-neutral/70 sticky rounded-box z-50 w-4/5 m-auto">
                <div className="flex-none">
                    <button className="btn btn-square btn-ghost">
                        <Menu className='size-6' />
                    </button>
                </div>
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">PGSO</a>
                </div>
            </div>
        </div>
    )
}
