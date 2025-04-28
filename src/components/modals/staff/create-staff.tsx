"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { StaffService } from "@/lib/api/services/staff-service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { staffSchema, type StaffFormValues } from "@/schemas/staff-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";

interface Division {
  id: number;
  division_name: string;
}

interface CreateStaffProps {
  onStaffCreated: () => void;
}

export default function CreateStaff({ onStaffCreated }: CreateStaffProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [divisionsLoading, setDivisionsLoading] = useState(false);
  const [divisionsError, setDivisionsError] = useState<string | null>(null);

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      number: "",
      division_id: "",
    },
  });

  useEffect(() => {
    const fetchDivisions = async () => {
      if (!open) return;

      setDivisionsLoading(true);
      setDivisionsError(null);

      try {
        const staffService = new StaffService();
        const response = await staffService.getDivisions();

        if (response.isSuccess) {
          setDivisions(response.divisions || []);
        } else {
          throw new Error("Failed to fetch divisions");
        }
      } catch (error) {
        console.error("Error fetching divisions:", error);
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        setDivisionsError(errorMessage);

        if (
          errorMessage.includes("Authentication required") ||
          errorMessage.includes("token not found")
        ) {
          toast.error("Please log in again to continue");
        } else if (errorMessage.includes("Failed to fetch")) {
          toast.error(
            "Network error. Please check your connection and try again."
          );
        } else {
          toast.error(`Failed to load divisions: ${errorMessage}`);
        }
      } finally {
        setDivisionsLoading(false);
      }
    };

    fetchDivisions();
  }, [open]);

  const onSubmit = async (data: StaffFormValues) => {
    try {
      setLoading(true);
      const staffService = new StaffService();

      console.log("Submitting staff data:", {
        ...data,
        division_id: parseInt(data.division_id),
      });

      const response = await staffService.createStaff({
        ...data,
        division_id: parseInt(data.division_id),
      });

      console.log("Create staff response:", response);

      if (response.isSuccess) {
        toast.success("Staff created successfully");
        setOpen(false);
        onStaffCreated();
        form.reset();
      } else {
        toast.error(response.message || "Failed to create staff");
      }
    } catch (error) {
      console.error("Error creating staff:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create staff";

      if (
        errorMessage.includes("Authentication required") ||
        errorMessage.includes("token not found")
      ) {
        toast.error("Please log in again to continue");
      } else if (errorMessage.includes("validation failed")) {
        toast.error(errorMessage);
      } else {
        toast.error(`Failed to create staff: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<StaffFormValues, "number">
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 11) {
      field.onChange(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Staff</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Staff</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new staff member.
          </DialogDescription>
        </DialogHeader>

        {divisionsError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{divisionsError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter first name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter last name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="Enter email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => handlePhoneNumberChange(e, field)}
                      placeholder="Enter 11-digit phone number"
                      maxLength={11}
                    />
                  </FormControl>
                  <FormDescription>
                    Phone number must be exactly 11 digits
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="division_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division</FormLabel>
                  <FormControl>
                    <div>
                      {divisionsLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">
                            Loading divisions...
                          </span>
                        </div>
                      ) : (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select division" />
                          </SelectTrigger>
                          <SelectContent>
                            {divisions.map((division) => (
                              <SelectItem
                                key={division.id}
                                value={division.id.toString()}
                              >
                                {division.division_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading || divisionsLoading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Staff
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
