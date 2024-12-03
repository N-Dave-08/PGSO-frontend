import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function Feedback({ formData, updateFormData, onPrevious, onComplete }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Feedback</h2>
      <div>
        <h3 className="font-medium">Requestor Information</h3>
        <p>Name: {formData.requestor.name}</p>
        <p>Department: {formData.requestor.department}</p>
        <p>Division: {formData.requestor.division}</p>
      </div>
      <div>
        <h3 className="font-medium">Request Details</h3>
        <p>Title: {formData.title}</p>
        <p>Description: {formData.description}</p>
        <p>Category: {formData.category}</p>
        <p>Priority Level: {formData.priorityLevel}</p>
        <p>Fiscal Year: {formData.fiscalYear}</p>
        <p>Location: {formData.location}</p>
      </div>
      <div>
        <h3 className="font-medium">Assigned Personnel</h3>
        <ul>
          {formData.assignedPersonnel.map((person, index) => (
            <li key={index}>{person}</li>
          ))}
        </ul>
      </div>
      <div>
        <Label htmlFor="feedback">Feedback</Label>
        <Textarea
          id="feedback"
          value={formData.feedback}
          onChange={(e) => updateFormData({ feedback: e.target.value })}
          placeholder="Please provide your feedback on the service"
          required
        />
      </div>
      <div className="flex justify-between">
        <Button type="button" onClick={onPrevious}>Previous</Button>
        <Button type="submit">Complete</Button>
      </div>
    </form>
  )
}

