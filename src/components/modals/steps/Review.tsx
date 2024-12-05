import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getCategories } from "@/lib/api/categories"

export default function Review({ formData, onNext, updateFormData }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [role, setRole] = useState<string>('')

  useEffect(() => {
    const role = localStorage.getItem('role')
    setRole(role)
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const categoriesData = response.categories || [];
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
        <h3 className="font-semibold">Request Details</h3>
        {requestDetails.map(({ label, value }) => (
          <p key={label} className="font-medium">
            {label}: <span className="font-light">{value}</span>
          </p>
        ))}
      </div>
      {
        role === 'head' && (
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => updateFormData({ category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading">Loading categories...</SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.category_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )
      }

      <div className="flex justify-between">
        {/* <Button onClick={onPrevious}>Previous</Button> */}
        {
          role === 'head' && (
            <div className="flex gap-3">
              <Button variant="ghost">Reject</Button>
              <Button onClick={onNext}>Accept</Button>
            </div>
          )
        }
      </div>
    </div>
  )
}

