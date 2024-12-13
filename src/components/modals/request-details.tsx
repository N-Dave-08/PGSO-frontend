import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { updateRequestStatus } from "@/lib/api/requests"

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
}

export function RequestDetailsModal({ request, trigger }: RequestDetailsModalProps) {
  const [userRole, setUserRole] = useState<string | null>(null)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUserRole(localStorage.getItem('role'))
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
        window.location.reload()
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
          <DialogDescription>
            Control No: {request.control_no}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
              <span className="col-span-3">{request.category_name || 'Not assigned'}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Personnel:</span>
              <span className="col-span-3">
                {Array.isArray(request.personnel) && request.personnel.length > 0
                  ? request.personnel.map(p => p.name).join(", ")
                  : "No personnel assigned"}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Status:</span>
              <span className="col-span-3 capitalize">{request.status}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Date Requested:</span>
              <span className="col-span-3">{request.date_requested}</span>
            </div>
            {request.date_completed && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Date Completed:</span>
                <span className="col-span-3">{request.date_completed}</span>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Requested By:</span>
              <div className="col-span-3">
                <p>{`${request.requested_by.first_name} ${request.requested_by.last_name}`}</p>
                <p className="text-sm text-muted-foreground">{request.requested_by.department}</p>
                <p className="text-sm text-muted-foreground">{request.requested_by.division}</p>
              </div>
            </div>
            {request.rating !== null && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Rating:</span>
                <span className="col-span-3">{request.rating}</span>
              </div>
            )}
            {request.feedback && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Feedback:</span>
                <span className="col-span-3">{request.feedback}</span>
              </div>
            )}
            {request.file_url && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Request File:</span>
                <Link
                  href={request.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-3 text-blue-600 hover:underline"
                >
                  View Request File
                </Link>
              </div>
            )}
            {request.file_completion_url && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Completion File:</span>
                <Image
                  height={300}
                  width={300}
                  alt="completetio image"
                  src={request.file_completion_url}
                />
              </div>
            )}
            {
              userRole === 'head' && request.status === 'Pending' ? (
                <div className="flex w-full justify-end gap-2">
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
              ) : ''
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}