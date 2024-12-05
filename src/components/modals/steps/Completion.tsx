import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function Completion({ formData, updateFormData, onNext }) {

  const [role, setRole] = useState<string>('')

  useEffect(() => {
    const role = localStorage.getItem('role')
    setRole(role)
  }, [])

  const handleComplete = () => {
    updateFormData({
      status: 'completed',
      serviceCompleted: true,
      completionDate: new Date().toISOString()
    })
    onNext()
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
      <div className="bg-base-300 p-4 rounded-box">
        <h3 className="font-medium">Task Details</h3>
        <div className="space-y-2">
          <p><span className="font-medium">Title:</span> {formData.title}</p>
          <p><span className="font-medium">Description:</span> {formData.description}</p>
          <p><span className="font-medium">Category:</span> {formData.category}</p>
          <p><span className="font-medium">Priority Level:</span> {formData.priorityLevel}</p>
          <p><span className="font-medium">Location:</span> {formData.location}</p>
          <p><span className="font-medium">Assigned Date:</span> {formData.approvalDate ? new Date(formData.approvalDate).toLocaleDateString() : 'Not assigned'}</p>
        </div>
      </div>
      <div>
        <h3 className="font-medium">Assigned Personnel</h3>
        <ul>
          {formData.assignedPersonnel.map((person, index) => (
            <li key={index}>{person}</li>
          ))}
        </ul>
      </div>
      {
        role === 'personnel' && (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="complete"
                checked={formData.serviceCompleted}
                onCheckedChange={(checked) => updateFormData({ serviceCompleted: checked })}
              />
              <Label
                htmlFor="complete"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I confirm that this task has been completed
              </Label>
            </div>
            <div className="flex justify-between pt-4">
              {/* <Button onClick={onPrevious}>Previous</Button> */}
              <Button
                onClick={handleComplete}
                disabled={!formData.serviceCompleted}
              >
                Mark as Complete
              </Button>
            </div>
          </>
        )
      }
    </div>
  )
}
