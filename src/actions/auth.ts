import Cookies from 'js-cookie'

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

    if (user) {
        Cookies.set('session', JSON.stringify({ email: user.email, role: user.role }), {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        })

        return { success: true, message: 'log in successful', role: user.role }
    }
    return { success: false, message: 'invalid email or password' }
}

export function logout() {
    Cookies.remove('session')
}

export function getSession(): { email: string; role: 'head' | 'admin' | 'staff' | 'personnel' } | null {
    const session = Cookies.get('session')
    return session ? JSON.parse(session) : null
}