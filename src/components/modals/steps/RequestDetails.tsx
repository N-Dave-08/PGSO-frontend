import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function RequestDetails({ formData, updateFormData, onNext }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="Repair Air Condition"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="The air condition unit in room 201 is not cooling properly"
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => updateFormData({ category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="repair">Repair</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="installation">Installation</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="priorityLevel">Priority Level</Label>
        <Select
          value={formData.priorityLevel}
          onValueChange={(value) => updateFormData({ priorityLevel: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="fiscalYear">Fiscal Year</Label>
        <Input
          id="fiscalYear"
          value={formData.fiscalYear}
          onChange={(e) => updateFormData({ fiscalYear: e.target.value })}
          placeholder="2024"
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => updateFormData({ location: e.target.value })}
          placeholder="2nd floor, Administrative Building, Capitol Complex"
          required
        />
      </div>
      <div>
        <Label htmlFor="supportingFile">Supporting File</Label>
        <Input
          id="supportingFile"
          type="file"
          onChange={(e) => updateFormData({ supportingFile: e.target.files[0] })}
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}

