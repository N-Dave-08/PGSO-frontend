'use client'

import { useState, FormEvent } from 'react'
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
import { createDivision } from '@/lib/api/division'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CreateDivisionProps {
    onDivisionCreated: () => void;
}

const categories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    { id: 3, name: 'Category 3' },
    { id: 4, name: 'Category 4' },
]

export default function CreateDivision({ onDivisionCreated }: CreateDivisionProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [divisionName, setDivisionName] = useState<string>('')
    const [officeLocation, setOfficeLocation] = useState<string>('')
    const [categoryId, setCategoryId] = useState<string>('')
    const [staffCount, setStaffCount] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            await createDivision({
                division_name: divisionName,
                office_location: officeLocation,
                category_id: parseInt(categoryId, 10),
                staff: parseInt(staffCount, 10) || 0
            })

            setOpen(false)
            setDivisionName('')
            setOfficeLocation('')
            setCategoryId('')
            setStaffCount('')
            onDivisionCreated()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Division
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Division</DialogTitle>
                    <DialogDescription>
                        Fill in the division details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="divisionName">Division Name</Label>
                        <Input
                            id="divisionName"
                            value={divisionName}
                            onChange={(e) => setDivisionName(e.target.value)}
                            placeholder="Enter division name"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="officeLocation">Office Location</Label>
                        <Input
                            id="officeLocation"
                            value={officeLocation}
                            onChange={(e) => setOfficeLocation(e.target.value)}
                            placeholder="Enter office location"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={categoryId}
                            onValueChange={setCategoryId}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id.toString()}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="staffCount">Staff Count</Label>
                        <Input
                            id="staffCount"
                            value={staffCount}
                            onChange={(e) => setStaffCount(e.target.value)}
                            placeholder="Enter staff count"
                            required
                            type="number"
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create Division
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
