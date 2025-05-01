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
import { useEffect } from "react";

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
    setSelectedPersonnel,
    fetchCategories,
    loading,
  } = useRequestDetailStore();

  useEffect(() => {
    fetchCategories().catch(console.error);
  }, [fetchCategories]);

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
        <span>{request.requested_by.division_location}</span>
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
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading categories...
                    </SelectItem>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.category_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No categories available
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm mt-1">
              {loading
                ? "Loading category..."
                : request.category_name ||
                  categories.find((cat) => cat.id === request.category_id)
                    ?.category_name ||
                  "No category"}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="font-medium text-sm">Personnel:</span>
        <div className="space-y-2">
          {userRole === "admin" && request.status === "For Process" ? (
            selectedCategory ? (
              <div className="space-y-4">
                {/* Team Lead Section */}
                {categories
                  .find((cat) => cat.id.toString() === selectedCategory)
                  ?.personnel.filter((person) => person.is_team_lead)
                  .map((teamLead) => (
                    <div
                      key={teamLead.id}
                      className="border-l-2 border-primary pl-3 mb-2"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`person-${teamLead.id}`}
                          checked={selectedPersonnel.includes(teamLead.id)}
                          onCheckedChange={(checked) => {
                            const category = categories.find(
                              (cat) => cat.id.toString() === selectedCategory
                            );
                            if (category) {
                              if (checked) {
                                // When checking a team lead, uncheck any other team leads first
                                const otherTeamLeads = category.personnel
                                  .filter(
                                    (p) =>
                                      p.is_team_lead && p.id !== teamLead.id
                                  )
                                  .map((p) => p.id);

                                // Remove other team leads and their personnel from selection
                                const otherTeamLeadsPersonnel =
                                  category.personnel
                                    .filter(
                                      (p) =>
                                        !p.is_team_lead &&
                                        otherTeamLeads.includes(
                                          p.team_lead_id || -1
                                        )
                                    )
                                    .map((p) => p.id);

                                const filteredPersonnel =
                                  selectedPersonnel.filter(
                                    (id) =>
                                      !otherTeamLeads.includes(id) &&
                                      !otherTeamLeadsPersonnel.includes(id)
                                  );

                                // Add current team lead and their personnel
                                const teamPersonnel = category.personnel
                                  .filter((p) => !p.is_team_lead)
                                  .filter((p) => p.team_lead_id === teamLead.id)
                                  .map((p) => p.id);

                                setSelectedPersonnel([
                                  ...filteredPersonnel,
                                  teamLead.id,
                                  ...teamPersonnel,
                                ]);
                              } else {
                                // When unchecking, deselect them and their personnel
                                const teamPersonnel = category.personnel
                                  .filter((p) => !p.is_team_lead)
                                  .filter((p) => p.team_lead_id === teamLead.id)
                                  .map((p) => p.id);
                                setSelectedPersonnel(
                                  selectedPersonnel.filter(
                                    (id) =>
                                      id !== teamLead.id &&
                                      !teamPersonnel.includes(id)
                                  )
                                );
                              }
                            }
                          }}
                        />
                        <label
                          htmlFor={`person-${teamLead.id}`}
                          className="text-sm font-semibold text-primary flex items-center space-x-2"
                        >
                          <span>{teamLead.name}</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Team Lead
                          </span>
                        </label>
                      </div>

                      {/* Show only this team lead's personnel when selected */}
                      {selectedPersonnel.includes(teamLead.id) && (
                        <div className="pl-6 mt-2 space-y-2">
                          {categories
                            .find(
                              (cat) => cat.id.toString() === selectedCategory
                            )
                            ?.personnel.filter(
                              (p) =>
                                !p.is_team_lead &&
                                p.team_lead_id === teamLead.id
                            )
                            .map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center space-x-2"
                              >
                                <label className="text-sm font-medium leading-none">
                                  {member.name}
                                </label>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              "Select a category to view personnel"
            )
          ) : (
            <div className="space-y-2">
              {/* Display Team Lead */}
              {request.team_lead && (
                <div className="border-l-2 border-primary pl-3">
                  <span className="font-semibold text-primary">
                    {`${request.team_lead.first_name} ${request.team_lead.last_name}`}
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded ml-2">
                    Team Lead
                  </span>
                </div>
              )}

              {/* Display Regular Personnel with Checkboxes for Team Lead */}
              {userRole === "personnel" &&
                request.status === "For Assignment" && (
                  <div className="pl-3 mt-4 space-y-3">
                    <span className="text-sm font-medium">
                      Select Personnel to Assign:
                    </span>
                    {categories.find((cat) => cat.id === request.category_id)
                      ?.personnel ? (
                      <div className="space-y-2">
                        {categories
                          .find((cat) => cat.id === request.category_id)
                          ?.personnel.filter((p) => !p.is_team_lead) // Only show non-team-lead personnel
                          .map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`assign-personnel-${p.id}`}
                                checked={selectedPersonnel.includes(p.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedPersonnel([
                                      ...selectedPersonnel,
                                      p.id,
                                    ]);
                                  } else {
                                    setSelectedPersonnel(
                                      selectedPersonnel.filter(
                                        (id) => id !== p.id
                                      )
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`assign-personnel-${p.id}`}
                                className="text-sm text-muted-foreground"
                              >
                                {p.name}
                              </label>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No personnel available in this category
                      </p>
                    )}
                  </div>
                )}

              {/* Display Regular Personnel (Read-only view) */}
              {(userRole !== "personnel" ||
                request.status !== "For Assignment") &&
                Array.isArray(request.personnel) &&
                request.personnel.length > 0 && (
                  <div className="pl-3">
                    {request.personnel.map((p) => (
                      <div key={p.id} className="text-muted-foreground">
                        {p.name}
                      </div>
                    ))}
                  </div>
                )}

              {!request.team_lead &&
                (!Array.isArray(request.personnel) ||
                  request.personnel.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No personnel assigned
                  </p>
                )}
            </div>
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
