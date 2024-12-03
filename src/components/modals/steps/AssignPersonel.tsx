import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AssignPersonnel({ formData, updateFormData, onNext, onPrevious }) {
  const [newPersonnel, setNewPersonnel] = useState('')

  const addPersonnel = () => {
    if (newPersonnel.trim()) {
      updateFormData({
        assignedPersonnel: [...formData.assignedPersonnel, newPersonnel.trim()]
      })
      setNewPersonnel('')
    }
  }

  const requestorDetails = [
    { label: 'Name', value: formData.requestor.name },
    { label: 'Department', value: formData.requestor.department },
    { label: 'Division', value: formData.requestor.division },
  ]

  const requestDetails = [
    { label: 'Title', value: formData.title },
    { label: 'Description', value: formData.description },
    { label: 'Category', value: formData.category },
    { label: 'Priority Level', value: formData.priorityLevel },
    { label: 'Fiscal Year', value: formData.fiscalYear },
    { label: 'Location', value: formData.location }
  ];

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
        <div>
        {requestDetails.map(({ label, value }) => (
          <p key={label} className="font-medium">
            {label}: <span className="font-light">{value}</span>
          </p>
        ))}
      </div>
      </div>
      <div>
        <Label htmlFor="newPersonnel">Add Service Personnel</Label>
        <div className="flex gap-2">
          <Input
            id="newPersonnel"
            value={newPersonnel}
            onChange={(e) => setNewPersonnel(e.target.value)}
            placeholder="Enter personnel name"
          />
          <Button onClick={addPersonnel}>Add</Button>
        </div>
      </div>
      {formData.assignedPersonnel.length > 0 && (
        <div>
          <h3 className="font-medium">Assigned Personnel</h3>
          <ul>
            {formData.assignedPersonnel.map((person, index) => (
              <li key={index}>{person}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-between">
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onNext}>Submit</Button>
      </div>
    </div>
  )
}

