import * as React from "react";
import { Check, PlusCircle, X } from "lucide-react";
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
  optionsIcon?: React.ComponentType<{ className?: string }>;
}

export function DataTableFacetedFilter({
  title,
  options,
  onFilterChange,
  optionsIcon: DefaultIcon,
}: DataTableFacetedFilterProps) {
  const [selectedValue, setSelectedValue] = React.useState<string>();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFilterChange = (value: string) => {
    // If clicking the same value, clear it
    const newValue = value === selectedValue ? undefined : value;
    setSelectedValue(newValue);
    onFilterChange?.(newValue);
    setIsOpen(false);
  };

  const handleClearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValue(undefined);
    onFilterChange?.(undefined);
  };

  const selectedOption = selectedValue
    ? options.find((opt) => opt.value === selectedValue)
    : null;

  return (
    <div className="flex items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <PlusCircle className="mr-2 h-4 w-4" />
            {title}
            {selectedValue && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <div className="hidden space-x-1 lg:flex">
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedOption?.label}
                  </Badge>
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = option.value === selectedValue;
                  const Icon = option.icon || DefaultIcon;
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleFilterChange(option.value)}
                      className="flex items-center"
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
                      {Icon && (
                        <Icon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilter}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
