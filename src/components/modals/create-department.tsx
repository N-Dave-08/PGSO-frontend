'use client'

import { useState, FormEvent, useEffect } from 'react'
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
import { Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Checkbox } from "@/components/ui/checkbox"
import { getDivisions } from '@/lib/api/divisions'

interface Division {
    id: number
    division_name: string
    office_location: string
    staff: number
    created_at: string
}

interface CreateDepartmentProps {
    onDepartmentCreated: () => void;
}

export default function CreateDepartment({ onDepartmentCreated }: CreateDepartmentProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [departmentName, setDepartmentName] = useState<string>('')
    const [acronym, setAcronym] = useState<string>('')
    const [divisions, setDivisions] = useState<Division[]>([])
    const [selectedDivisions, setSelectedDivisions] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const router = useRouter()

    useEffect(() => {
        const fetchDivisions = async () => {
            try {
                const response = await getDivisions()
                setDivisions(response.divisions || [])
            } catch (error) {
                console.error('Failed to fetch divisions:', error)
            }
        }

        if (open) {
            fetchDivisions()
        }
    }, [open])

    const filteredDivisions = divisions.filter(division => 
        division.division_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDivisionToggle = (divisionId: number) => {
        setSelectedDivisions(prev => {
            if (prev.includes(divisionId)) {
                return prev.filter(id => id !== divisionId)
            } else {
                return [...prev, divisionId]
            }
        })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('https://server.pgso.bpc-bsis4d.com/public/api/admin/department/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    department_name: departmentName,
                    acronym,
                    division_id: selectedDivisions
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create department')
            }

            setOpen(false)
            setDepartmentName('')
            setAcronym('')
            setSelectedDivisions([])
            onDepartmentCreated()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Department
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Department</DialogTitle>
                    <DialogDescription>
                        Fill in the department details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="departmentName">Department Name</Label>
                        <Input
                            id="departmentName"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            placeholder="Enter department name"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="acronym">Acronym</Label>
                        <Input
                            id="acronym"
                            value={acronym}
                            onChange={(e) => setAcronym(e.target.value)}
                            placeholder="Enter acronym"
                            required
                        />
                    </div>
                    <div>
                        <Label>Divisions</Label>
                        <div className="mb-2">
                            <Input
                                type="text"
                                placeholder="Search divisions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="mb-2"
                            />
                        </div>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
                            {filteredDivisions.map((division) => (
                                <div key={division.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`division-${division.id}`}
                                        checked={selectedDivisions.includes(division.id)}
                                        onCheckedChange={() => handleDivisionToggle(division.id)}
                                    />
                                    <label
                                        htmlFor={`division-${division.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {division.division_name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    {error && (
                        <div className="text-sm text-red-500">
                            {error}
                        </div>
                    )}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create Department
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}