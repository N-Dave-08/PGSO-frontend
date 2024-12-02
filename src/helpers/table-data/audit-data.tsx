export type Audit = {
    id: string
    timeStamp: string
    name: string
    email: string
    role: string
    actionPerformed: string
    statusBefore: string
    statusAfter: string
}

export const auditData: Audit[] = [
    {
        id: "723ed52r",
        timeStamp: "2022-01-01T00:00:00",
        name: "John Doe",
        email: "johndoe@bpc.edu.ph",
        role: "Admin",
        actionPerformed: "Created Department",
        statusBefore: "N/A",
        statusAfter: "Active",
    },
    {
        id: "723ed52r",
        timeStamp: "2022-01-01T00:00:00",
        name: "John Doe",
        email: "johndoe@bpc.edu.ph",
        role: "Head",
        actionPerformed: "Approved Request",
        statusBefore: "Pending",
        statusAfter: "Approved",
    },
    {
        id: "723ed52r",
        timeStamp: "2022-01-01T00:00:00",
        name: "John Doe",
        email: "johndoe@bpc.edu.ph",
        role: "Head",
        actionPerformed: "Assigned a Request",
        statusBefore: "Approved",
        statusAfter: "Assigned",
    },
    {
        id: "723ed52r",
        timeStamp: "2022-01-01T00:00:00",
        name: "John Doe",
        email: "johndoe@bpc.edu.ph",
        role: "PGSO Staff",
        actionPerformed: "Created Request",
        statusBefore: "N/A",
        statusAfter: "Pending",
    },
]