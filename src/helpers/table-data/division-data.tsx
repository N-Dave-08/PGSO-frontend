export type Division = {
    id: string
    name: string
    officeLocation: string
    status: string
    staff: string[]
    dateCreated: string
    departmentId: string
}
  
export const divisionData: Division[] = [
    {
        id: "1",
        name: "Governor's Office",
        officeLocation: "Main Building, 2nd Floor",
        status: "Active",
        staff: ["John Doe", "Jane Doe", "Alice Smith", "Bob Johnson", "Mike Brown", "Emily Davis", "Sarah Taylor", "Kevin White", "Lisa Nguyen", "Michael Martin"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "723ed52f"
    },
    {
        id: "2",
        name: "Personal Staff",
        officeLocation: "Main Building, 3rd Floor",
        status: "Active",
        staff: ["Samantha Lee", "David Kim", "Olivia Brown", "Benjamin Davis", "Ava Garcia", "Ethan Martin", "Lily Chen", "Noah Hall", "Sophia Patel", "Logan Brooks", "Mia Lewis", "Alexander Brooks", "Isabella Walker", "Gabriel Hernandez", "Charlotte Jackson"],
        dateCreated: "2020-02-01T08:00:00",
        departmentId: "489e1d42"
    },
    {
        id: "3",
        name: "Vice Governor's Office",
        officeLocation: "Annex Building, 1st Floor",
        status: "Active",
        staff: ["Julia Rodriguez", "William Thompson", "Oliver Lee", "Abigail Martin"],
        dateCreated: "2020-03-01T08:00:00",
        departmentId: "a762d9c0"
    },
    {
        id: "4",
        name: "Vice Governor's Personal Staff",
        officeLocation: "Main Building, 1st Floor",
        status: "Active",
        staff: ["Alice Johnson", "Mark Smith", "Rachel Green"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "b3f12e8d"
    },
    {
        id: "5",
        name: "Secretary's Office",
        officeLocation: "Main Building, 1st Floor",
        status: "Active",
        staff: ["Tom Hardy", "Chris Evans"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "e9d71f6a"
    },
    {
        id: "6",
        name: "Environmental Conservation",
        officeLocation: "BENRO Office",
        status: "Active",
        staff: ["Natalie Portman", "Robert Pattinson"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "c4e5f6g7"
    },
    {
        id: "7",
        name: "Academic Affairs",
        officeLocation: "BPC Office",
        status: "Active",
        staff: ["Leonardo DiCaprio", "Kate Winslet"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "h8i9j0k1"
    },
    {
        id: "8",
        name: "Financial Management",
        officeLocation: "PAO Office",
        status: "Active",
        staff: ["Morgan Freeman", "Denzel Washington"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "l2m3n4o5"
    },
    {
        id: "9",
        name: "Human Resource Management",
        officeLocation: "PA's Office",
        status: "Active",
        staff: ["Hugh Jackman", "Ryan Reynolds"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "p6q7r8s9"
    },
    {
        id: "10",
        name: "Agricultural Development",
        officeLocation: "PAO Office",
        status: "Active",
        staff: ["Jennifer Lawrence", "Chris Pratt"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "t0u1v2w3"
    },
    {
        id: "11",
        name: "Property Assessment",
        officeLocation: "PAO Office",
        status: "Active",
        staff: ["Tom Hanks", "Meryl Streep"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "x4y5z6a7"
    },
    {
        id: "12",
        name: "Budget Preparation",
        officeLocation: "PBO Office",
        status: "Active",
        staff: ["Will Smith", "Jada Pinkett Smith"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "b8c9d0e1"
    },
    {
        id: "13",
        name: "Civil Security",
        officeLocation: "PCSJMO Office",
        status: "Active",
        staff: ["Ben Affleck", "Gal Gadot"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "f2g3h4i5"
    },
    {
        id: "14",
        name: "Cooperative Development",
        officeLocation: "PCEDO Office",
        status: "Active",
        staff: ["Chris Evans", "Scarlett Johansson"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "j6k7l8m9"
    },
    {
        id: "15",
        name: "Disaster Risk Reduction",
        officeLocation: "PDRRMO Office",
        status: "Active",
        staff: ["Tom Hardy", "Emma Watson"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "n0o1p2q3"
    },
    {
        id: "16",
        name: "Infrastructure Development",
        officeLocation: "PEO Office",
        status: "Active",
        staff: ["Leonardo DiCaprio", "Kate Winslet"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "r4s5t6u7"
    },
    {
        id: "17",
        name: "General Services",
        officeLocation: "PGSO Office",
        status: "Active",
        staff: ["Morgan Freeman", "Denzel Washington"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "v8w9x0y1"
    },
    {
        id: "18",
        name: "Cultural Heritage",
        officeLocation: "PHACTO Office",
        status: "Active",
        staff: ["Natalie Portman", "Robert Pattinson"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "z2a3b4c5"
    },
    {
        id: "19",
        name: "Human Resource Management",
        officeLocation: "PHRMO Office",
        status: "Active",
        staff: ["Hugh Jackman", "Ryan Reynolds"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "d6e7f8g9"
    },
    {
        id: "20",
        name: "IT Infrastructure",
        officeLocation: "PITO Office",
        status: "Active",
        staff: ["Will Smith", "Jada Pinkett Smith"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "h1i2j3k4"
    },
    {
        id: "21",
        name: "Legal Services",
        officeLocation: "PLO Office",
        status: "Active",
        staff: ["Ben Affleck", "Gal Gadot"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "l5m6n7o8"
    },
    {
        id: "22",
        name: "Planning and Development",
        officeLocation: "PPDO Office",
        status: "Active",
        staff: ["Chris Evans", "Scarlett Johansson"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "p9q0r1s2"
    },
    {
        id: "23",
        name: "Public Affairs",
        officeLocation: "PPAO Office",
        status: "Active",
        staff: ["Tom Hardy", "Emma Watson"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "t3u4v5w6"
    },
    {
        id: "24",
        name: "Employment Services",
        officeLocation: "PPESO Office",
        status: "Active",
        staff: ["Leonardo DiCaprio", "Kate Winslet"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "x7y8z9a0"
    },
    {
        id: "25",
        name: "Public Health Services",
        officeLocation: "PPHO Office",
        status: "Active",
        staff: ["Morgan Freeman", "Denzel Washington"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "b1c2d3e4"
    },
    {
        id: "26",
        name: "Social Welfare Services",
        officeLocation: "PSWDO Office",
        status: "Active",
        staff: ["Hugh Jackman", "Ryan Reynolds"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "f5g6h7i8"
    },
    {
        id: "27",
        name: "Treasury Operations",
        officeLocation: "PTO Office",
        status: "Active",
        staff: ["Tom Hanks", "Meryl Streep"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "j9k0l1m2"
    },
    {
        id: "28",
        name: "Animal Health",
        officeLocation: "PVO Office",
        status: "Active",
        staff: ["Ben Affleck", "Gal Gadot"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "n3o4p5q6"
    },
    {
        id: "29",
        name: "Youth Development",
        officeLocation: "PYSDO Office",
        status: "Active",
        staff: ["Chris Evans", "Scarlett Johansson"],
        dateCreated: "2020-01-01T08:00:00",
        departmentId: "r7s8t9u0"
    },
    
]