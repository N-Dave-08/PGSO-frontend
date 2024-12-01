'use client'

import { useState } from 'react'
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
import { Eye, EyeClosed, Mail, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authenticate } from '@/actions/auth'

export default function LoginModal() {
    const [open, setOpen] = useState(false)
    const [isSecured, setIsSecured] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        const result = await authenticate(formData)
        if (result.success) {
            router.push('/dashboard')
        } else {
            setError(result.message)
        }
    }

    const handlePassword = () => {
        setIsSecured(!isSecured)
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
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className='size-4 opacity-40 absolute top-1/2 left-3 -translate-y-1/2' />
                            <Input
                                name='email'
                                id="email"
                                type="email"
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
                                type={`${isSecured ? 'text' : 'password'}`}
                                placeholder="Enter your password"
                                className='pl-10'
                                required
                            />
                            <div onClick={handlePassword} className='absolute top-1/2 right-3 -translate-y-1/2 hover:cursor-pointer'>
                                {
                                    isSecured ? <Eye className='size-4' /> : <EyeClosed className='size-4' />
                                }
                            </div>
                        </div>
                        {error && <p className="text-error text-sm">{error}</p>}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Log In</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

