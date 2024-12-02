'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function withRoleProtection(WrappedComponent: React.ComponentType, allowedRoles: string[]) {
  return function ProtectedRoute(props: any) {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!user || !allowedRoles.includes(user.role)) {
        router.push('/')
      }
    }, [user, router])

    if (!user || !allowedRoles.includes(user.role)) {
      return (
        'loading'
      )
    }

    return <WrappedComponent {...props} />
  }
}

