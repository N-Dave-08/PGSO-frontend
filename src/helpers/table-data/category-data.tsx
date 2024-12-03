export type Category = {
    id: string
    name: string
    description: string
    dateCreated: string
  }
  
  export const categoryData: Category[] = [
    {
      id: "1",
      name: "Cleaning",
      description: "This category includes all cleaning related tasks and activities.",
      dateCreated: "2022-01-01T00:00:00",
    },
    {
      id: "2",
      name: "Electrical",
      description: "This category includes all electrical repair related tasks and activities.",
      dateCreated: "2022-02-01T00:00:00",
    },
    {
      id: "3",
      name: "Plumbing",
      description: "This category includes all plumbing repair related tasks and activities.",
      dateCreated: "2022-03-01T00:00:00",
    },
    {
      id: "4",
      name: "Carpentry",
      description: "This category includes all carpentry repair related tasks and activities.",
      dateCreated: "2022-04-01T00:00:00",
    },
    {
      id: "5",
      name: "Painting",
      description: "This category includes all painting and surface finishing related tasks and activities.",
      dateCreated: "2022-06-01T00:00:00",
    },
  ]