"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/form";
import { StaffService } from "@/lib/api/services/staff-service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { staffSchema, type StaffFormValues } from "@/schemas/staff-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { Staff } from "@/types/staffs";

interface Division {
  id: number;
  division_name: string;
}

interface EditStaffProps {
  staff: Staff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStaffUpdated: () => Promise<void>;
}

export default function EditStaff({
  staff,
  open,
  onOpenChange,
  onStaffUpdated,
}: EditStaffProps) {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      first_name: staff.first_name,
      last_name: staff.last_name,
      email: staff.email,
      number: staff.number,
      division_id: staff.division.division_id.toString(),
    },
  });

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const staffService = new StaffService();
        const response = await staffService.getDivisions();
        if (response.isSuccess) {
          setDivisions(response.divisions);
        }
      } catch (error) {
        console.error("Failed to fetch divisions:", error);
        toast.error("Failed to load divisions");
      }
    };

    if (open) {
      fetchDivisions();
    }
  }, [open]);

  const onSubmit = async (data: StaffFormValues) => {
    try {
      setLoading(true);
      const staffService = new StaffService();

      const response = await staffService.updateStaff(staff.id, {
        ...data,
        division_id: parseInt(data.division_id),
      });

      if (response.isSuccess) {
        toast.success("Staff updated successfully");
        onOpenChange(false);
        await onStaffUpdated();
        form.reset();
      } else {
        toast.error(response.message || "Failed to update staff");
      }
    } catch (error) {
      console.error("Error updating staff:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update staff";
      toast.error(`Failed to update staff: ${errorMessage}`);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
          <DialogDescription>
            Update the staff member&apos;s information below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} type="email" />
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
                      maxLength={11}
                      placeholder="Enter 11-digit phone number"
                    />
                  </FormControl>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a division" />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Staff
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
