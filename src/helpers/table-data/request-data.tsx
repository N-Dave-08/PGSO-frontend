export type Request = {
    id: string
    controlNum: string
    requestedBy: string
    role: "head" | "PGSO Staff"
    category: string
    status: "pending" | "rejected" | "to assign" | "waiting" | "for feedback" | "completed"
    priority: string
    assignTo: string[]
    requested: string
    dueDate: string
  }
  
  export const requestData: Request[] = [
    {
      id: "723ed52f",
      controlNum: "2024-0124",
      requestedBy: "John Doe",
      role: "head",
      category: "Cleaning",
      status: "pending",
      priority: "High",
      assignTo: [],
      requested: "2022-01-01T00:00:00",
      dueDate: "2022-01-02T00:00:00",
    },
    {
      id: "a1b2c3d4",
      controlNum: "2024-0125",
      requestedBy: "Jane Doe",
      role: "PGSO Staff",
      category: "Electrical",
      status: "to assign",
      priority: "Medium",
      assignTo: [],
      requested: "2022-02-01T00:00:00",
      dueDate: "2022-02-03T00:00:00",
    },
    {
      id: "e5f6g7h8",
      controlNum: "2024-0126",
      requestedBy: "Jim Smith",
      role: "PGSO Staff",
      category: "Plumbing",
      status: "for feedback",
      priority: "Low",
      assignTo: ["Emily Johnson"],
      requested: "2022-03-01T00:00:00",
      dueDate: "2022-03-02T00:00:00",
    },
    {
      id: "i9j0k1l2",
      controlNum: "2024-0127",
      requestedBy: "Emily Johnson",
      role: "head",
      category: "Carpentry",
      status: "completed",
      priority: "High",
      assignTo: ["Jim Smith"],
      requested: "2022-04-01T00:00:00",
      dueDate: "2022-04-03T00:00:00",
    },
    {
      id: "m3n4o5p6",
      controlNum: "2024-0128",
      requestedBy: "Michael Brown",
      role: "head",
      category: "Cleaning",
      status: "rejected",
      priority: "Medium",
      assignTo: [],
      requested: "2022-05-01T00:00:00",
      dueDate: "2022-05-02T00:00:00",
    },
    {
      id: "q7r8s9t0",
      controlNum: "2024-0129",
      requestedBy: "Sarah Lee",
      role: "PGSO Staff",
      category: "Electrical",
      status: "to assign",
      priority: "Low",
      assignTo: [],
      requested: "2022-06-01T00:00:00",
      dueDate: "2022-06-03T00:00:00",
    },
    {
      id: "u1v2w3x4",
      controlNum: "2024-0130",
      requestedBy: "David Wilson",
      role: "head",
      category: "HVAC",
      status: "waiting",
      priority: "High",
      assignTo: ["Robert Chen"],
      requested: "2022-07-01T00:00:00",
      dueDate: "2022-07-03T00:00:00",
    },
  ]