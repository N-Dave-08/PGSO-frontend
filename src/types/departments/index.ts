import { Division, Staff } from "@/types";

export interface Head {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Department {
  id: number;
  department_name: string;
  acronym: string;
  staff: Staff[];
  head: Head;
  divisions: Division[];
}
