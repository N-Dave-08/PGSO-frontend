'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Eye,
    EyeClosed,
    Mail,
    Lock,
    Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'


export default function LoginModal() {
    const [open, setOpen] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('https://server.pgso.bpc-bsis4d.com/public/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
            }

            localStorage.setItem('token', data.token)
            window.dispatchEvent(new Event('authChange'))
            localStorage.setItem('role', data.role)
            localStorage.setItem('user', JSON.stringify(data.user))
            router.push('/dashboard')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePassword = () => {
        setIsShowPassword(!isShowPassword)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">Log In</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Log In</DialogTitle>
                    <DialogDescription>
                        Enter your credentials to access your account.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className='size-4 opacity-40 absolute top-1/2 left-3 -translate-y-1/2' />
                            <Input
                                name='email'
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className='pl-10'
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className='size-4 opacity-40 absolute top-1/2 left-3 -translate-y-1/2' />
                            <Input
                                name='password'
                                id="password"
                                type={`${isShowPassword ? 'text' : 'password'}`}
                                value={password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className='pl-10'
                                required
                            />
                            <div onClick={handlePassword} className='absolute top-1/2 right-3 -translate-y-1/2 hover:cursor-pointer'>
                                {
                                    isShowPassword ? <Eye className='size-4' /> : <EyeClosed className='size-4' />
                                }
                            </div>
                        </div>
                        {error && <p className="text-error text-sm">{error}</p>}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        {
                            !isLoading ? (<Button variant='secondary' type="submit">Log In</Button>)
                                : (
                                    <Button variant='secondary' disabled>
                                        <Loader2 className="animate-spin" />
                                        Please wait
                                    </Button>
                                )
                        }
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}


