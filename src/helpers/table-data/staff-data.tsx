export type Staff = {
  id: string
  name: string
  phoneNumber: string
  email: string
  status: "Active" | "Inactive"
  lastLogin: string
  department: string
  division: string
  dateCreated: string
}

export const staffData: Staff[] = [
  // Governor's Office Staff
  {
    id: "GOV001",
    name: "John Doe",
    phoneNumber: "+63 912 345 6789",
    email: "john.doe@pgso.gov.ph",
    status: "Inactive",
    lastLogin: "2024-03-20T10:30:00",
    department: "Executive",
    division: "Governor's Office",
    dateCreated: "2020-01-01T08:00:00"
  },
  {
    id: "GOV002",
    name: "Jane Doe",
    phoneNumber: "+63 917 123 4567",
    email: "jane.doe@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-19T15:45:00",
    department: "Executive",
    division: "Governor's Office",
    dateCreated: "2020-01-01T08:00:00"
  },
  {
    id: "GOV003",
    name: "Alice Smith",
    phoneNumber: "+63 918 234 5678",
    email: "alice.smith@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-19T14:20:00",
    department: "Executive",
    division: "Governor's Office",
    dateCreated: "2020-01-01T08:00:00"
  },
  {
    id: "GOV004",
    name: "Bob Johnson",
    phoneNumber: "+63 919 345 6789",
    email: "bob.johnson@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-19T16:15:00",
    department: "Executive",
    division: "Governor's Office",
    dateCreated: "2020-01-01T08:00:00"
  },
  {
    id: "GOV005",
    name: "Mike Brown",
    phoneNumber: "+63 920 456 7890",
    email: "mike.brown@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T09:30:00",
    department: "Executive",
    division: "Governor's Office",
    dateCreated: "2020-01-01T08:00:00"
  },
  {
    id: "GOV006",
    name: "Emily Davis",
    phoneNumber: "+63 921 567 8901",
    email: "emily.davis@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T08:45:00",
    department: "Executive",
    division: "Governor's Office",
    dateCreated: "2020-01-01T08:00:00"
  },
  {
    id: "GOV007",
    name: "Sarah Taylor",
    phoneNumber: "+63 922 678 9012",
    email: "sarah.taylor@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-19T17:00:00",
    department: "Executive",
    division: "Governor's Office",
    dateCreated: "2020-01-01T08:00:00"
  },
  {
    id: "GOV008",
    name: "Kevin White",
    phoneNumber: "+63 923 789 0123",
    email: "kevin.white@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T11:20:00",
    department: "Executive",
    division: "Governor's Office",
    dateCreated: "2020-01-01T08:00:00"
  },
  {
    id: "GOV009",
    name: "Lisa Nguyen",
    phoneNumber: "+63 924 890 1234",
    email: "lisa.nguyen@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T10:15:00",
    department: "Executive",
    division: "Governor's Office",
    dateCreated: "2020-01-01T08:00:00"
  },
  {
    id: "GOV010",
    name: "Michael Martin",
    phoneNumber: "+63 925 901 2345",
    email: "michael.martin@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-19T16:45:00",
    department: "Executive",
    division: "Governor's Office",
    dateCreated: "2020-01-01T08:00:00"
  },

  // Personal Staff
  {
    id: "PS001",
    name: "Samantha Lee",
    phoneNumber: "+63 926 012 3456",
    email: "samantha.lee@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T09:00:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS002",
    name: "David Kim",
    phoneNumber: "+63 927 123 4567",
    email: "david.kim@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T08:30:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS003",
    name: "Olivia Brown",
    phoneNumber: "+63 928 234 5678",
    email: "olivia.brown@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-19T17:15:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS004",
    name: "Benjamin Davis",
    phoneNumber: "+63 929 345 6789",
    email: "benjamin.davis@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T10:45:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS005",
    name: "Ava Garcia",
    phoneNumber: "+63 930 456 7890",
    email: "ava.garcia@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T11:00:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS006",
    name: "Ethan Martin",
    phoneNumber: "+63 931 567 8901",
    email: "ethan.martin@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-19T16:30:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS007",
    name: "Lily Chen",
    phoneNumber: "+63 932 678 9012",
    email: "lily.chen@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T09:15:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS008",
    name: "Noah Hall",
    phoneNumber: "+63 933 789 0123",
    email: "noah.hall@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T10:00:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS009",
    name: "Sophia Patel",
    phoneNumber: "+63 934 890 1234",
    email: "sophia.patel@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-19T15:30:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS010",
    name: "Logan Brooks",
    phoneNumber: "+63 935 901 2345",
    email: "logan.brooks@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T11:30:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS011",
    name: "Mia Lewis",
    phoneNumber: "+63 936 012 3456",
    email: "mia.lewis@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T08:15:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS012",
    name: "Alexander Brooks",
    phoneNumber: "+63 937 123 4567",
    email: "alexander.brooks@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-19T17:30:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS013",
    name: "Isabella Walker",
    phoneNumber: "+63 938 234 5678",
    email: "isabella.walker@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T09:45:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS014",
    name: "Gabriel Hernandez",
    phoneNumber: "+63 939 345 6789",
    email: "gabriel.hernandez@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T10:15:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },
  {
    id: "PS015",
    name: "Charlotte Jackson",
    phoneNumber: "+63 940 456 7890",
    email: "charlotte.jackson@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-19T16:00:00",
    department: "Executive",
    division: "Personal Staff",
    dateCreated: "2020-02-01T08:00:00"
  },

  // Vice Governor's Office Staff
  {
    id: "VG001",
    name: "Julia Rodriguez",
    phoneNumber: "+63 941 567 8901",
    email: "julia.rodriguez@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T09:30:00",
    department: "Executive",
    division: "Vice Governor's Office",
    dateCreated: "2020-03-01T08:00:00"
  },
  {
    id: "VG002",
    name: "William Thompson",
    phoneNumber: "+63 942 678 9012",
    email: "william.thompson@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T10:45:00",
    department: "Executive",
    division: "Vice Governor's Office",
    dateCreated: "2020-03-01T08:00:00"
  },
  {
    id: "VG003",
    name: "Oliver Lee",
    phoneNumber: "+63 943 789 0123",
    email: "oliver.lee@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-19T15:15:00",
    department: "Executive",
    division: "Vice Governor's Office",
    dateCreated: "2020-03-01T08:00:00"
  },
  {
    id: "VG004",
    name: "Abigail Martin",
    phoneNumber: "+63 944 890 1234",
    email: "abigail.martin@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T11:15:00",
    department: "Executive",
    division: "Vice Governor's Office",
    dateCreated: "2020-03-01T08:00:00"
  },

  // Vice Governor's Personal Staff
  {
    id: "VGP001",
    name: "Alice Johnson",
    phoneNumber: "+63 945 901 2345",
    email: "alice.johnson@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T08:45:00",
    department: "Executive",
    division: "Vice Governor's Personal Staff",
    dateCreated: "2020-01-01T08:00:00"
  },
  {
    id: "VGP002",
    name: "Mark Smith",
    phoneNumber: "+63 946 012 3456",
    email: "mark.smith@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-19T16:45:00",
    department: "Executive",
    division: "Vice Governor's Personal Staff",
    dateCreated: "2020-01-01T08:00:00"
  },
  {
    id: "VGP003",
    name: "Rachel Green",
    phoneNumber: "+63 947 123 4567",
    email: "rachel.green@pgso.gov.ph",
    status: "Active",
    lastLogin: "2024-03-20T10:30:00",
    department: "Executive",
    division: "Vice Governor's Personal Staff",
    dateCreated: "2020-01-01T08:00:00"
  }
]