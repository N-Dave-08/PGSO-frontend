export interface Personnel {
  id: number;
  name: string;
  role: string;
}

export async function getPersonnel(): Promise<Personnel[]> {
  // TODO: Replace with actual API call
  const response = await fetch("/api/personnel");
  return response.json();
}
