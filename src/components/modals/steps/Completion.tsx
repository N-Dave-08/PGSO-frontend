import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function Completion({ formData, updateFormData, onNext, onPrevious }) {
  const handleServiceCompletion = (checked: boolean) => {
    updateFormData({ serviceCompleted: checked })
  }

  const requestorDetails = [
    { label: 'Name', value: formData.requestor.name },
    { label: 'Department', value: formData.requestor.department },
    { label: 'Division', value: formData.requestor.division },
  ]

  return (
    <div className="space-y-4">
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

