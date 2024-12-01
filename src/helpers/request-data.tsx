export type Request = {
    id: string
    controlNum: number
    requestedBy: string
    role: string
    category: string
    priority: string
    assignTo: string
    requested: string
    dueDate: string
  }
  
  export const requestData: Request[] = [
    {
      id: "723ed52f",
      controlNum: 123,
      requestedBy: "John Doe",
      role: "Manager",
      category: "Cleaning",
      priority: "High",
      assignTo: "Jane Doe",
      requested: "2022-01-01T00:00:00",
      dueDate: "2022-01-02T00:00:00",
    },
    {
      id: "a1b2c3d4",
      controlNum: 124,
      requestedBy: "Jane Doe",
      role: "Assistant",
      category: "Electrical",
      priority: "Medium",
      assignTo: "John Doe",
      requested: "2022-02-01T00:00:00",
      dueDate: "2022-02-03T00:00:00",
    },
    {
      id: "e5f6g7h8",
      controlNum: 125,
      requestedBy: "Jim Smith",
      role: "Engineer",
      category: "Plumbing",
      priority: "Low",
      assignTo: "Emily Johnson",
      requested: "2022-03-01T00:00:00",
      dueDate: "2022-03-02T00:00:00",
    },
    {
      id: "i9j0k1l2",
      controlNum: 126,
      requestedBy: "Emily Johnson",
      role: "Designer",
      category: "Carpentry",
      priority: "High",
      assignTo: "Jim Smith",
      requested: "2022-04-01T00:00:00",
      dueDate: "2022-04-03T00:00:00",
    },
    {
      id: "m3n4o5p6",
      controlNum: 127,
      requestedBy: "Michael Brown",
      role: "Manager",
      category: "Cleaning",
      priority: "Medium",
      assignTo: "Sarah Lee",
      requested: "2022-05-01T00:00:00",
      dueDate: "2022-05-02T00:00:00",
    },
    {
      id: "q7r8s9t0",
      controlNum: 128,
      requestedBy: "Sarah Lee",
      role: "Assistant",
      category: "Electrical",
      priority: "Low",
      assignTo: "Michael Brown",
      requested: "2022-06-01T00:00:00",
      dueDate: "2022-06-03T00:00:00",
    },
  ]