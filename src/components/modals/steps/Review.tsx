import { Button } from "@/components/ui/button"

export default function Review({ formData, onNext, onPrevious }) {

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
      <h3 className="font-semibold">Request Details</h3>
        {requestDetails.map(({ label, value }) => (
          <p key={label} className="font-medium">
            {label}: <span className="font-light">{value}</span>
          </p>
        ))}
      </div>
      <div className="flex justify-between">
        <Button onClick={onPrevious}>Previous</Button>
        <div className="flex gap-3">
          <Button variant="ghost">Reject</Button>
          <Button onClick={onNext}>Accept</Button>
        </div>
      </div>
    </div>
  )
}

