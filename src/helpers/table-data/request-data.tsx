export type Request = {
    id: string
    controlNum: string
    requestedBy: string
    role: "head" | "PGSO Staff"
    category: string
    priority: string
    assignTo: string
    requested: string
    dueDate: string
  }
  
  export const requestData: Request[] = [
    {
      id: "723ed52f",
      controlNum: "2024-0124", // Changed to the new format
      requestedBy: "John Doe",
      role: "head",
      category: "Cleaning",
      priority: "High",
      assignTo: "Jane Doe",
      requested: "2022-01-01T00:00:00",
      dueDate: "2022-01-02T00:00:00",
    },
    {
      id: "a1b2c3d4",
      controlNum: "2024-0125", // Changed to the new format
      requestedBy: "Jane Doe",
      role: "PGSO Staff",
      category: "Electrical",
      priority: "Medium",
      assignTo: "John Doe",
      requested: "2022-02-01T00:00:00",
      dueDate: "2022-02-03T00:00:00",
    },
    {
      id: "e5f6g7h8",
      controlNum: "2024-0126", // Changed to the new format
      requestedBy: "Jim Smith",
      role: "PGSO Staff",
      category: "Plumbing",
      priority: "Low",
      assignTo: "Emily Johnson",
      requested: "2022-03-01T00:00:00",
      dueDate: "2022-03-02T00:00:00",
    },
    {
      id: "i9j0k1l2",
      controlNum: "2024-0127", // Changed to the new format
      requestedBy: "Emily Johnson",
      role: "head",
      category: "Carpentry",
      priority: "High",
      assignTo: "Jim Smith",
      requested: "2022-04-01T00:00:00",
      dueDate: "2022-04-03T00:00:00",
    },
    {
      id: "m3n4o5p6",
      controlNum: "2024-0128", // Changed to the new format
      requestedBy: "Michael Brown",
      role: "head",
      category: "Cleaning",
      priority: "Medium",
      assignTo: "Sarah Lee",
      requested: "2022-05-01T00:00:00",
      dueDate: "2022-05-02T00:00:00",
    },
    {
      id: "q7r8s9t0",
      controlNum: "2024-0129", // Changed to the new format
      requestedBy: "Sarah Lee",
      role: "PGSO Staff",
      category: "Electrical",
      priority: "Low",
      assignTo: "Michael Brown",
      requested: "2022-06-01T00:00:00",
      dueDate: "2022-06-03T00:00:00",
    },
  ]