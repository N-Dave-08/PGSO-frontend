'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<any>(null)
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
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard, {user.email}</h1>
      <p>Your role is: {role}</p>
    </div>
  )
}

