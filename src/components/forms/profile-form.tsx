"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/types/users";
import { LoginUser } from "@/types/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { profileFormSchema, ProfileFormValues } from "@/schemas";
import { toast } from "sonner";

interface ProfileFormProps {
  user: User | LoginUser;
  onSave: (values: ProfileFormValues) => Promise<void>;
}

export function ProfileForm({ user, onSave }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Create a ref for the initial values to avoid resetting form on parent re-render
  const formValuesRef = React.useRef({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    number: user.number ? String(user.number) : "",
    age: user.age ? user.age.toString() : "",
    gender: user.gender || "",
    current_password: "",
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: formValuesRef.current,
    mode: "onChange",
  });

  // Update form with user data when it changes
  React.useEffect(() => {
    if (user) {
      // Only update visible fields, not the password field
      form.setValue("first_name", user.first_name || "");
      form.setValue("last_name", user.last_name || "");
      form.setValue("email", user.email || "");
      form.setValue("number", user.number ? String(user.number) : "");
      form.setValue("age", user.age ? user.age.toString() : "");
      form.setValue("gender", user.gender || "");
    }
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    try {
      await onSave(data);
      toast.success("Your profile has been updated successfully.");
      // Reset the password field after successful submission
      form.setValue("current_password", "");
    } catch (error: any) {
      // Check if it's a password error
      const errorMessage =
        error.message || "Failed to update profile. Please try again.";
      const isPasswordError = errorMessage.toLowerCase().includes("password");

      // If it's a password error, set error on the password field
      if (isPasswordError) {
        form.setError("current_password", {
          message: errorMessage,
        });
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // Helper function to safely get user properties
  const getUserProperty = (propertyName: string): string => {
    return (user as any)[propertyName] || "";
  };

  const getInitials = (): string => {
    const firstName = getUserProperty("first_name");
    const lastName = getUserProperty("last_name");
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update your profile information. This information will be displayed
          publicly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={getUserProperty("avatar") || ""}
              alt={`${getUserProperty("first_name")} ${getUserProperty(
                "last_name"
              )}`}
            />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-medium">{`${getUserProperty(
              "first_name"
            )} ${getUserProperty("last_name")}`}</h3>
            {getUserProperty("role_name") && (
              <p className="text-sm text-muted-foreground">
                {getUserProperty("role_name")}
              </p>
            )}
            {getUserProperty("department_name") && (
              <p className="text-sm text-muted-foreground">
                {getUserProperty("department_name")}
              </p>
            )}
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
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
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="09XXXXXXXXX"
                        {...field}
                        onChange={(e) => {
                          // Only allow digits in the input
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Age"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your current password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="px-0 pb-0">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
