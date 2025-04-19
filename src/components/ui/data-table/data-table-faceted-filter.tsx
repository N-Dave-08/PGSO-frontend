import * as React from "react";
import { Check, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DataTableFacetedFilterProps {
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onFilterChange?: (value: string | undefined) => void;
}

export function DataTableFacetedFilter({
  title,
  options,
  onFilterChange,
}: DataTableFacetedFilterProps) {
  const [selectedValue, setSelectedValue] = React.useState<string>();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFilterChange = (value: string) => {
    // If clicking the same value, clear it
    if (value === selectedValue) {
      setSelectedValue(undefined);
    } else {
      setSelectedValue(value);
    }
  };

  const handleClearFilter = () => {
    setSelectedValue(undefined);
    onFilterChange?.(undefined);
    setIsOpen(false);
  };

  const handleApplyFilter = () => {
    onFilterChange?.(selectedValue);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValue && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="hidden space-x-1 lg:flex">
                {options
                  .filter((option) => option.value === selectedValue)
                  .map((option) => (
                    <Badge
                      variant="secondary"
                      key={option.value}
                      className="rounded-sm px-1 font-normal"
                    >
                      {option.label}
                    </Badge>
                  ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleFilterChange(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <div className="p-2 flex items-center gap-2">
              {selectedValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilter}
                  className="flex-1"
                >
                  Clear
                </Button>
              )}
              <Button
                size="sm"
                onClick={handleApplyFilter}
                className="flex-1"
                disabled={!selectedValue}
              >
                Apply Filter
              </Button>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
