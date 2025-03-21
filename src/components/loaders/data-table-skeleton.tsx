import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableSkeletonProps {
  columns?: number;
  rows?: number;
  showHeader?: boolean;
  showToolbar?: boolean;
}

export function DataTableSkeleton({
  columns = 6,
  rows = 12,
  showHeader = true,
  showToolbar = true,
}: DataTableSkeletonProps) {
  return (
    <div className="w-full space-y-4">
      {showToolbar && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-[280px] rounded-md bg-muted/70 animate-pulse" />
            <div className="h-9 w-[140px] rounded-md bg-muted/70 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-[80px] rounded-md bg-muted/70 animate-pulse" />
            <div className="h-9 w-[120px] rounded-md bg-muted/70 animate-pulse" />
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          {showHeader && (
            <TableHeader>
              <TableRow>
                {Array.from({ length: columns }).map((_, i) => (
                  <TableHead key={i}>
                    <div className="h-7 w-full max-w-[120px] rounded-md bg-muted/70 animate-pulse" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: columns }).map((_, j) => (
                  <TableCell key={j}>
                    <div className="h-6 w-full max-w-[140px] rounded-md bg-muted/60 animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-9 w-[120px] rounded-md bg-muted/70 animate-pulse" />
        <div className="h-9 w-[240px] rounded-md bg-muted/70 animate-pulse" />
      </div>
    </div>
  );
}
