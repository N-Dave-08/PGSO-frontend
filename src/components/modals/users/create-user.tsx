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
import { UserService } from "@/lib/api/services/user-service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { userSchema, type UserFormValues } from "@/schemas/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";

interface Role {
  id: number;
  role_name: string;
}

interface CreateUserProps {
  onUserCreated: (response: any) => void;
}

export default function CreateUser({ onUserCreated }: CreateUserProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      number: "",
      role_name: "",
      avatar: "",
    },
  });

  useEffect(() => {
    const fetchRoles = async () => {
      if (!open) return;

      setRolesLoading(true);
      setRolesError(null);

      try {
        const userService = new UserService();
        const response = await userService.getRoles();

        if (response.isSuccess) {
          setRoles(response.user_types || []);
        } else {
          throw new Error("Failed to fetch roles");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        setRolesError(errorMessage);

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
          toast.error(`Failed to load roles: ${errorMessage}`);
        }
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, [open]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true);
      const userService = new UserService();

      console.log("Submitting user data:", data);

      const response = await userService.createUser(data);

      console.log("Create user response:", response);

      if (response.isSuccess) {
        toast.success("User created successfully");
        setOpen(false);
        onUserCreated(response);
        form.reset();
      } else {
        toast.error(response.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create user";

      if (
        errorMessage.includes("Authentication required") ||
        errorMessage.includes("token not found")
      ) {
        toast.error("Please log in again to continue");
      } else if (errorMessage.includes("validation failed")) {
        toast.error(errorMessage);
      } else {
        toast.error(`Failed to create user: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<UserFormValues, "number">
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 11) {
      field.onChange(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user.
          </DialogDescription>
        </DialogHeader>

        {rolesError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{rolesError}</AlertDescription>
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
              name="role_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <div>
                      {rolesLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">
                            Loading roles...
                          </span>
                        </div>
                      ) : (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.role_name}>
                                {role.role_name}
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
              <Button type="submit" disabled={loading || rolesLoading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
