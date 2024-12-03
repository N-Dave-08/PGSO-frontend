import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StarRating } from "@/components/StarRating"

export default function Feedback({ formData, updateFormData, onPrevious, onComplete }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete()
  }

  const requestorDetails = [
    { label: 'Name', value: formData.requestor.name },
    { label: 'Department', value: formData.requestor.department },
    { label: 'Division', value: formData.requestor.division },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Feedback</h2>
      <div className="bg-base-300 p-4 rounded-box">
        <h3 className="font-medium">Requestor Information</h3>
        {requestorDetails.map(({ label, value }) => (
          <p key={label} className="font-medium">
            {label}: <span className="font-light">{value}</span>
          </p>
        ))}
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
        <Label htmlFor="rating">Rate the service</Label>
        <StarRating
          rating={formData.rating}
          onRatingChange={(rating) => updateFormData({ rating })}
        />
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

