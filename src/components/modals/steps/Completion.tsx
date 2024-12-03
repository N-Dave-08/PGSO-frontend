import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function Completion({ formData, updateFormData, onNext, onPrevious }) {
  const handleServiceCompletion = (checked: boolean) => {
    updateFormData({ serviceCompleted: checked })
  }

  return (
    <div className="space-y-4">
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
      <div className="flex items-center space-x-2">
        <Checkbox
          id="serviceCompleted"
          checked={formData.serviceCompleted}
          onCheckedChange={handleServiceCompletion}
        />
        <Label htmlFor="serviceCompleted">Service Completed</Label>
      </div>
      <div className="flex justify-between">
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onNext} disabled={!formData.serviceCompleted}>Next</Button>
      </div>
    </div>
  )
}

