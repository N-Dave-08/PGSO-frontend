import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onSearch?: (searchTerm: string) => void;
  children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  onSearch,
  children,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchValue, setSearchValue] = React.useState("");
  const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setSearchValue(value);

    // Clear any existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set a new timeout to trigger the search after 300ms of no typing
    searchTimeout.current = setTimeout(() => {
      onSearch?.(value);
    }, 300);
  };

  React.useEffect(() => {
    return (): void => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const handleClear = () => {
    setSearchValue("");
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    onSearch?.("");
    if (isFiltered) {
      table.resetColumnFilters();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search table..."
            value={searchValue}
            onChange={(event) => handleSearch(event.target.value)}
            className="h-8 w-[150px] pl-8 lg:w-[250px]"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 h-8 w-8 p-0 hover:bg-transparent"
              onClick={handleClear}
            >
              <Cross2Icon className="h-4 w-4" />
            </Button>
          )}
        </div>
        {children}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleClear}
            className="h-8 px-2 lg:px-3"
          >
            Reset filters
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
