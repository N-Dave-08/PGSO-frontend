export type Task = {
    taskId: string
    title: string
    status: "Not Started" | "In Progress" | "Completed"
    assignedTo: string[]
    dateRequested: string
    location: string
    supportingFile?: string
    requestor: {
        name: string
        department: string
        division: string
    }
}

export const taskData: Task[] = [
    {
        taskId: "TASK-001",
        title: "Review Purchase Request for IT Equipment",
        status: "In Progress",
        assignedTo: ["John Doe", "Sarah Wilson"],
        dateRequested: "2024-02-15T09:30:00",
        location: "Main Office - 3rd Floor",
        supportingFile: "purchase_request.pdf",
        requestor: {
            name: "John Michael",
            department: "Sample Department",
            division: "Sample Division"
        }
    },
    {
        taskId: "TASK-002",
        title: "Process Office Supplies Request",
        status: "Not Started",
        assignedTo: ["John Doe"],
        dateRequested: "2024-02-16T11:20:00",
        location: "Main Office - 2nd Floor",
        requestor: {
            name: "Jane Smith",
            department: "Sample Department",
            division: "Sample Division"
        }
    },
    {
        taskId: "TASK-003",
        title: "Evaluate Vendor Proposals",
        status: "Completed",
        assignedTo: ["John Doe", "Robert Brown", "Lisa Anderson"],
        dateRequested: "2024-02-14T13:45:00",
        location: "Branch Office - Conference Room",
        requestor: {
            name: "Alice Johnson",
            department: "Sample Department",
            division: "Sample Division"
        }
    },
]
