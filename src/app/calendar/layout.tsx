'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserType {
    id: number
    email: string
}

export default function Layout({
    children,
    admin,
    head,
    personnel,
    staff,
}: {
    children?: React.ReactNode
    admin?: React.ReactNode
    head?: React.ReactNode
    personnel?: React.ReactNode
    staff?: React.ReactNode
}) {
    const [user, setUser] = useState<UserType | null>(null)
    const [role, setRole] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        setRole(localStorage.getItem('role'))
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        } else {
            router.push('/')
        }
    }, [router])

    if (!user) {
        return <div className='h-screen flex items-center justify-center'>Loading...</div>
    }

    const isAuthorized = (allowedRoles: string[]) => {
        if (!role) return false
        return allowedRoles.includes(role)
    }

    const renderContent = () => {
        switch (role) {
            case 'admin':
                return isAuthorized(['admin']) ? admin : null
            case 'head':
                return isAuthorized(['head']) ? head : null
            case 'personnel':
                return isAuthorized(['personnel']) ? personnel : null
            case 'staff':
                return isAuthorized(['staff']) ? staff : null
            default:
                return null
        }
    }

    return (
            <main className="p-4 w-full">
                {children}
                {renderContent()}
            </main>
    )
}
