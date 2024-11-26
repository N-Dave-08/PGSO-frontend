export type User = {
    id: string
    name: string
    email: string
    role: string
    status: "Active" | "Inactive"
    lastLogin: string
  }
  
  export const userData: User[] = [
    {
      id: "728ed52f",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2023-01-23T13:23:45",
    },
    {
      id: "489e1d42",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "Inactive",
      lastLogin: "2023-03-15T09:00:00",
    },
    {
      id: "a762d9c0",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "Manager",
      status: "Active",
      lastLogin: "2023-04-01T11:30:00",
    },
    {
      id: "b3f12e8d",
      name: "Bob Williams",
      email: "bob@example.com",
      role: "User",
      status: "Active",
      lastLogin: "2023-03-28T16:45:00",
    },
    {
      id: "e9d71f6a",
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
      status: "Inactive",
      lastLogin: "2023-02-14T08:15:00",
    },
  ]
  
  