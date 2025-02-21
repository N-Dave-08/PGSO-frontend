import { Division } from "@/types";

export interface Department {
  id: number;
  department_name: string;
  acronym: string;
  divisions: Division[];
}
