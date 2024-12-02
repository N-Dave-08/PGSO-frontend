'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Define the UserType interface
interface UserType {
  id: number
  email: string
}

export default function Categories() {
  const [user, setUser] = useState<UserType | null>(null)
  const router = useRouter()

  useEffect(() => {
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
      <h1 className="text-lg font-bold">Categories</h1>
      <p className='text-sm'>Exploring Diversity in Every Segment</p>
    </div>
  )
}

