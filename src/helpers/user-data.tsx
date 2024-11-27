export type User = {
    id: string
    name: string
    email: string
    role: string
    status: "Active" | "Inactive"
    lastLogin: string
    department: string
    division: string
    dateCreated: string
    phoneNumber: string
  }
  
  export const userData: User[] = [
    {
      id: "728ed52f",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2023-01-23T13:23:45",
      department: "IT",
      division: "Software Development",
      dateCreated: "2022-01-01T00:00:00",
      phoneNumber: "123-456-7890",
    },
    {
      id: "489e1d42",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "Inactive",
      lastLogin: "2023-03-15T09:00:00",
      department: "HR",
      division: "Recruitment",
      dateCreated: "2022-02-01T00:00:00",
      phoneNumber: "234-567-8901",
    },
    {
      id: "a762d9c0",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "Manager",
      status: "Active",
      lastLogin: "2023-04-01T11:30:00",
      department: "Finance",
      division: "Accounting",
      dateCreated: "2022-03-01T00:00:00",
      phoneNumber: "345-678-9012",
    },
    {
      id: "b3f12e8d",
      name: "Bob Williams",
      email: "bob@example.com",
      role: "User",
      status: "Active",
      lastLogin: "2023-03-28T16:45:00",
      department: "Marketing",
      division: "Digital",
      dateCreated: "2022-04-01T00:00:00",
      phoneNumber: "456-789-0123",
    },
    {
      id: "e9d71f6a",
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
      status: "Inactive",
      lastLogin: "2023-02-14T08:15:00",
      department: "Sales",
      division: "Retail",
      dateCreated: "2022-05-01T00:00:00",
      phoneNumber: "567-890-1234",
    },
  ]