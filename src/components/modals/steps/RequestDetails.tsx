import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface RequestFormData {
    title: string
    description: string
    location: string
}

interface RequestDetailsProps {
    formData: RequestFormData
    updateFormData: (data: Partial<RequestFormData>) => void
    onNext: () => void
}

export default function RequestDetails({ formData, updateFormData, onNext }: RequestDetailsProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onNext()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="Enter request title"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder="Enter request description"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData({ location: e.target.value })}
                    placeholder="Enter location"
                    required
                />
            </div>
            <div className="flex justify-end">
                <Button type="submit">Next</Button>
            </div>
        </form>
    )
}