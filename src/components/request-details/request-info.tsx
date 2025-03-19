"use client";

import { Request } from "@/types";
import { useRequestDetailStore } from "@/store/request-detail-store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

interface RequestInfoProps {
  request: Request;
}

export function RequestInfo({ request }: RequestInfoProps) {
  const {
    userRole,
    categories,
    selectedCategory,
    selectedPersonnel,
    setSelectedCategory,
    togglePersonnel,
  } = useRequestDetailStore();

  const formatDate = (date: string) => {
    return dayjs(date).format("MMM D, YYYY");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1">
        <span className="font-medium text-sm">Title:</span>
        <span>{request.request_title}</span>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="font-medium text-sm">Description:</span>
        <span>{request.description}</span>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="font-medium text-sm">Location:</span>
        <span>{request.requested_by.office_location}</span>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="font-medium text-sm">Category:</span>
        <div>
          {userRole === "admin" && request.status === "For Process" ? (
            <Select
              defaultValue={request.category_id?.toString()}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm mt-1">
              {categories.find((cat) => cat.id === request.category_id)
                ?.category_name || "No category"}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="font-medium text-sm">Personnel:</span>
        <div className="space-y-2">
          {userRole === "admin" && request.status === "For Process" ? (
            selectedCategory ? (
              categories
                .find((cat) => cat.id.toString() === selectedCategory)
                ?.personnel.map((person) => (
                  <div key={person.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`person-${person.id}`}
                      checked={selectedPersonnel.includes(person.id)}
                      onCheckedChange={(checked) => {
                        togglePersonnel(person.id, checked === true);
                      }}
                    />
                    <label
                      htmlFor={`person-${person.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {person.name}
                    </label>
                  </div>
                )) || "No personnel in this category"
            ) : (
              "Select a category to view personnel"
            )
          ) : (
            <p className="text-sm">
              {Array.isArray(request.personnel) && request.personnel.length > 0
                ? request.personnel.map((p) => p.name).join(", ")
                : "No personnel assigned"}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="font-medium text-sm">Status:</span>
        <span className="capitalize">{request.status}</span>
      </div>
      {request.status === "Returned" && (
        <div className="flex flex-col space-y-1">
          <span className="font-medium text-sm">Reason:</span>
          <span className="capitalize">{request.note}</span>
        </div>
      )}
      <div className="flex flex-col space-y-1">
        <span className="font-medium text-sm">Date Requested:</span>
        <span>{formatDate(request.date_requested)}</span>
      </div>
      {request.date_completed && (
        <div className="flex flex-col space-y-1">
          <span className="font-medium text-sm">Date Completed:</span>
          <span>{formatDate(request.date_completed)}</span>
        </div>
      )}
      {userRole !== "staff" && (
        <div className="flex flex-col space-y-1">
          <span className="font-medium text-sm">Requested By:</span>
          <div>
            <p>{`${request.requested_by.first_name} ${request.requested_by.last_name}`}</p>
            <p className="text-sm text-muted-foreground">
              {request.requested_by.department}
            </p>
            <p className="text-sm text-muted-foreground">
              {request.requested_by.division}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
