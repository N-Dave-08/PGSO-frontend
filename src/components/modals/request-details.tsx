import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { updateRequestStatus, assessRequest } from "@/lib/api/requests"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import axios from 'axios'

// Initialize dayjs plugins
dayjs.extend(utc)
dayjs.extend(timezone)

interface RequestDetailsModalProps {
  request: {
    id: number
    control_no: string
    request_title: string
    description: string
    file_path: string | null
    file_url: string | null
    file_completion: string | null
    file_completion_url: string | null
    category_id: number | null
    category_name: string | null
    personnel: {
      id: number
      name: string
    }[]
    feedback: string | null
    rating: number | null
    status: string
    date_requested: string
    date_completed: string | null
    requested_by: {
      id: number
      first_name: string
      last_name: string
      department: string
      division: string
      office_location: string
    }
  }
  trigger: React.ReactNode
  onRequestUpdate?: () => void
}

export function RequestDetailsModal({ request, trigger, onRequestUpdate }: RequestDetailsModalProps) {
  const [userRole, setUserRole] = useState<string | null>(null)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Array<{
    id: number;
    category_name: string;
    personnel: Array<{ id: number; name: string }>;
  }>>([])
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    request.category_id?.toString()
  )
  const [selectedPersonnel, setSelectedPersonnel] = useState<number[]>(
    request.personnel?.map(p => p.id) || []
  )
  const [isAssessing, setIsAssessing] = useState(false)
  const [completionFile, setCompletionFile] = useState<File | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>("")
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)

  useEffect(() => {
    setUserRole(localStorage.getItem('role'))
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('https://server.pgso.bpc-bsis4d.com/public/api/dropdown/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (data.isSuccess) {
          setCategories(data.categories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleStatusUpdate = async (status: 'Approved' | 'Rejected') => {
    try {
      setLoading(true)
      const response = await updateRequestStatus(request.id, status)

      if (response.isSuccess) {
        toast({
          title: "Success",
          description: response.message,
        })
        onRequestUpdate?.()
        setOpen(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update request status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAssessRequest = async () => {
    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    if (selectedPersonnel.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one personnel",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAssessing(true);
      const response = await assessRequest(request.id, {
        category_id: parseInt(selectedCategory),
        personnel_ids: selectedPersonnel
      });

      toast({
        title: "Success",
        description: response.message,
      });
      onRequestUpdate?.()
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assess request",
        variant: "destructive",
      });
    } finally {
      setIsAssessing(false);
    }
  };

  const handleCompletionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCompletionFile(e.target.files[0])
    }
  }

  const handleMarkAsComplete = async () => {
    if (!completionFile) {
      toast({
        title: "Error",
        description: "Please select a completion file",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCompleting(true)
      const formData = new FormData()
      formData.append('file_completion', completionFile)

      const token = localStorage.getItem('token')
      const response = await axios.post(
        `https://server.pgso.bpc-bsis4d.com/public/api/request/completion/${request.id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.data) {
        toast({
          title: "Success",
          description: response.data.message || "Request marked as complete",
        })
        await onRequestUpdate?.()
        setOpen(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mark request as complete",
        variant: "destructive",
      })
    } finally {
      setIsCompleting(false)
    }
  }

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please provide a rating",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmittingFeedback(true)
      const token = localStorage.getItem('token')
      
      // Log the request payload for debugging
      console.log('Submitting feedback with:', {
        rating,
        feedback,
        requestId: request.id
      })

      const response = await axios.post(
        `https://server.pgso.bpc-bsis4d.com/public/api/request/feedback/${request.id}`,
        {
          feedback: feedback,
          rating: rating
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.data) {
        toast({
          title: "Success",
          description: "Feedback submitted successfully",
        })
        await onRequestUpdate?.()
        setOpen(false)
      }
    } catch (error: any) {
      console.error('Feedback submission error:', error.response?.data || error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
          <DialogDescription>
            Control No: {request.control_no}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-[2fr,1fr] gap-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Title:</span>
              <span className="col-span-3">{request.request_title}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Description:</span>
              <span className="col-span-3">{request.description}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Location:</span>
              <span className="col-span-3">{request.requested_by.office_location}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Category:</span>
              <div className="col-span-3">
                {userRole === 'admin' && request.status === "For Process" ? (
                  <Select
                    defaultValue={request.category_id?.toString()}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.category_name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm mt-1">
                    {categories.find(cat => cat.id === request.category_id)?.category_name || "No category"}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Personnel:</span>
              <div className="col-span-3 space-y-2">
                {userRole === 'admin' && request.status === "For Process" ? (
                  selectedCategory ? (
                    categories.find(cat => cat.id.toString() === selectedCategory)?.personnel.map(person => (
                      <div key={person.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`person-${person.id}`}
                          checked={selectedPersonnel.includes(person.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPersonnel(prev => [...prev, person.id])
                            } else {
                              setSelectedPersonnel(prev => prev.filter(id => id !== person.id))
                            }
                          }}
                        />
                        <label
                          htmlFor={`person-${person.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {person.name}
                        </label>
                      </div>
                    )) || "No personnel in this category"
                  ) : (
                    "Select a category to view personnel"
                  )
                ) : (
                  <p className="text-sm">
                    {Array.isArray(request.personnel) && request.personnel.length > 0
                      ? request.personnel.map(p => p.name).join(", ")
                      : "No personnel assigned"}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Status:</span>
              <span className="col-span-3 capitalize">{request.status}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Date Requested:</span>
              <span className="col-span-3">{dayjs(request.date_requested).tz("Asia/Manila").format("MMM D, YYYY")}</span>
            </div>
            {request.date_completed && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Date Completed:</span>
                <span className="col-span-3">{dayjs(request.date_completed).tz("Asia/Manila").format("MMM D, YYYY")}</span>
              </div>
            )}
            {userRole !== 'staff' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Requested By:</span>
                <div className="col-span-3">
                  <p>{`${request.requested_by.first_name} ${request.requested_by.last_name}`}</p>
                  <p className="text-sm text-muted-foreground">{request.requested_by.department}</p>
                  <p className="text-sm text-muted-foreground">{request.requested_by.division}</p>
                </div>
              </div>
            )}

            {userRole === 'personnel' && request.status === 'For Completion' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Completion File:</span>
                <div className="col-span-3">
                  <Input
                    type="file"
                    onChange={handleCompletionFileChange}
                    accept="image/*"
                  />
                </div>
              </div>
            )}

            {request.rating !== null && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Rating:</span>
                <div className="col-span-3 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-2xl focus:outline-none transition-colors duration-150"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        {star <= (hoverRating || rating) ? (
                          <span className="text-yellow-400">★</span>
                        ) : (
                          <span className="text-gray-300 hover:text-yellow-200">★</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-sm font-medium">
                      ({rating} {rating === 1 ? 'star' : 'stars'})
                    </span>
                  )}
                </div>
              </div>
            )}
            {request.feedback && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Feedback:</span>
                <span className="col-span-3">{request.feedback}</span>
              </div>
            )}
            {userRole === 'staff' && request.status === 'For Feedback' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Rating:</span>
                <div className="col-span-3 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-2xl focus:outline-none transition-colors duration-150"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        {star <= (hoverRating || rating) ? (
                          <span className="text-yellow-400">★</span>
                        ) : (
                          <span className="text-gray-300 hover:text-yellow-200">★</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-sm font-medium">
                      ({rating} {rating === 1 ? 'star' : 'stars'})
                    </span>
                  )}
                </div>
              </div>
            )}
            {userRole === 'staff' && request.status === 'For Feedback' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Feedback:</span>
                <div className="col-span-3">
                  <Input
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {request.file_url && (
                <div className="space-y-2">
                  <h4 className="font-medium">Supporting Image:</h4>
                  <div className="rounded-lg overflow-hidden border">
                    <Image
                      alt="supporting image"
                      src={request.file_url}
                      height={400}
                      width={400}
                      className="w-full h-[300px] object-cover"
                    />
                  </div>
                </div>
              )}
              {request.file_completion_url && (
                <div className="space-y-2">
                  <h4 className="font-medium">Completion:</h4>
                  <div className="rounded-lg overflow-hidden border">
                    <Image
                      alt="completion image"
                      src={request.file_completion_url}
                      height={400}
                      width={400}
                      className="w-full h-[300px] object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          {
            userRole === 'admin' && request.status === 'For Process' && (
              <Button
                onClick={handleAssessRequest}
                disabled={isAssessing}
              >
                {isAssessing ? "Assigning..." : "Assign"}
              </Button>
            )
          }
          {userRole === 'head' && request.status === 'Pending' && (
            <div className="flex gap-2">
              <Button
                variant={'ghost'}
                onClick={() => handleStatusUpdate('Rejected')}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Reject'}
              </Button>
              <Button
                onClick={() => handleStatusUpdate('Approved')}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Accept'}
              </Button>
            </div>
          )}
          {
            userRole === 'personnel' && request.status === 'For Completion' && (
              <Button
                onClick={handleMarkAsComplete}
                disabled={isCompleting}
              >
                {isCompleting ? "Processing..." : "Mark as Complete"}
              </Button>
            )
          }
          {
            userRole === 'staff' && request.status === 'For Feedback' && (
              <Button
                onClick={handleSubmitFeedback}
                disabled={isSubmittingFeedback}
              >
                {isSubmittingFeedback ? "Submitting..." : "Submit"}
              </Button>
            )
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}