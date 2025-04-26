import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadCSV, downloadExcel, downloadPDF } from "@/lib/utils/export";
import { toast } from "sonner";

type FlattenedDataValue = string | number | boolean | null | undefined;

interface DataTableExportProps<T extends Record<string, FlattenedDataValue>> {
  data: T[];
  headers: Record<string, string>;
  filename: string;
}

export function DataTableExport<T extends Record<string, FlattenedDataValue>>({
  data,
  headers,
  filename,
}: DataTableExportProps<T>) {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = React.useCallback(
    async (format: "csv" | "excel" | "pdf") => {
      try {
        setIsExporting(true);
        const extension = format === "excel" ? "xlsx" : format;
        const fullFilename = `${filename}.${extension}`;

        switch (format) {
          case "csv":
            downloadCSV(data, headers, fullFilename);
            break;
          case "excel":
            downloadExcel(data, headers, fullFilename);
            break;
          case "pdf":
            await downloadPDF(data, headers, fullFilename);
            break;
        }
      } catch (error) {
        console.error("Error exporting file:", error);
        toast.error("Failed to export file");
      } finally {
        setIsExporting(false);
      }
    },
    [data, headers, filename]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          disabled={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
