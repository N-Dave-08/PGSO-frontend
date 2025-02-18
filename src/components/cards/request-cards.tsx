"use client"

import * as React from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Request } from "@/lib/columns/request-columns"
import { RequestDetailsModal } from "@/components/modals/request-details"

interface RequestCardsProps {
  data: Request[]
  onRequestUpdate?: () => void
}

export function RequestCards({data, onRequestUpdate}: RequestCardsProps) {
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [selectedRequest, setSelectedRequest] = React.useState<Request | null>(null)

  const filteredData = React.useMemo(() => {
    return data.filter(request => {
      const searchTerm = globalFilter.toLowerCase()
      return (
        request.control_no.toLowerCase().includes(searchTerm) ||
        request.request_title.toLowerCase().includes(searchTerm) ||
        request.description.toLowerCase().includes(searchTerm) ||
        request.status.toLowerCase().includes(searchTerm) ||
        request.requested_by.first_name.toLowerCase().includes(searchTerm) ||
        request.requested_by.last_name.toLowerCase().includes(searchTerm)
      )
    })
  }, [data, globalFilter])

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder="Search requests..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((request) => (
          <Card key={request.id} className="bg-card hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">{request.control_no}</CardTitle>
                <Badge variant={
                  request.status === 'Pending' ? 'default' :
                  request.status === 'In Progress' ? 'secondary' :
                  request.status === 'Completed' ? 'success' : 'destructive'
                }>
                  {request.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-medium mb-2">{request.request_title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
              <div className="mt-4 text-sm">
                <p className="text-muted-foreground">
                  Requested by: {request.requested_by.first_name} {request.requested_by.last_name}
                </p>
                <p className="text-muted-foreground">
                  Department: {request.requested_by.department}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <RequestDetailsModal
                request={request}
                onRequestUpdate={onRequestUpdate}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 ml-auto"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                }
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
