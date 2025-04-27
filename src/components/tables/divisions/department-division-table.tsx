"use client";

import * as React from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "@/components/tables/divisions/department-division-columns";

interface DepartmentDivision {
  id: number;
  division_name: string;
  office_location: string;
}

interface DepartmentDivisionTableProps {
  data: DepartmentDivision[];
}

export function DepartmentDivisionTable({
  data,
}: DepartmentDivisionTableProps) {
  return <DataTable data={data} columns={columns} />;
}
