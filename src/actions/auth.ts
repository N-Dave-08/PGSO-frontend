'use server'

import { cookies } from "next/headers"

type AuthResult = {
    success: boolean
    message: string
    role?: 'head' | 'admin' | 'staff' | 'personnel'
}

type User = {
    email: string
    password: string
    role: 'head' | 'admin' | 'staff' | 'personnel'
}

const users: User[] = [
    {
        email: 'head@example.com',
        password: 'headpassword',
        role: 'head'
    },
    {
        email: 'admin@example.com',
        password: 'adminpassword',
        role: 'admin'
    },
    {
        email: 'pgso@example.com',
        password: 'pgsoPassword',
        role: 'staff'
    },
    {
        email: 'service@example.com',
        password: 'servicePassword',
        role: 'personnel'
    }
]

export async function authenticate(formData: FormData): Promise<AuthResult> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const user = users.find(user => user.email === email && user.password === password)

    const cookiesStore = await cookies();
    if (user) {
        cookiesStore.set('session', JSON.stringify({ email: user.email, role: user.role }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        })

        return { success: true, message: 'log in successful', role: user.role }
    }
    return { success: false, message: 'invalid email or password' }
}

export async function logout() {
    const cookiesStore = await cookies()
    cookiesStore.delete('session')
}

export async function getSession(): Promise<{ email: string; role: 'head' | 'admin' | 'staff' | 'personnel' } | null> {
    const cookiesStore = await cookies()
    const session = cookiesStore.get('session')?.value
    return session ? JSON.parse(session) : null
}