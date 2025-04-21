import { create } from "zustand";
import { Request, RequestStatusResponse } from "@/types";
import { updateRequestStatus, assignRequest } from "@/lib/api/requests";
import axios from "axios";
import { secureStorage } from "@/lib/utils/encryption";
import { Category } from "@/types/categories";
import api, { getAuthHeaders } from "@/lib/api/axios";

interface RequestDetailState {
  request: Request | null;
  userRole: string | null;
  categories: Category[];
  selectedCategory: string | undefined;
  selectedPersonnel: number[];
  rejectionNote: string;
  showRejectionDialog: boolean;
  loading: boolean;
  isAssessing: boolean;
  isCompleting: boolean;
  completionFile: File | null;
  rating: number;
  hoverRating: number;
  feedback: string;
  isSubmittingFeedback: boolean;

  // Actions
  setRequest: (request: Request) => void;
  fetchUserRole: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  setSelectedCategory: (categoryId: string | undefined) => void;
  setSelectedPersonnel: (personnelIds: number[]) => void;
  togglePersonnel: (personnelId: number, isChecked: boolean) => void;
  setRejectionNote: (note: string) => Promise<void>;
  toggleRejectionDialog: (show: boolean) => void;
  handleStatusUpdate: (
    requestId: number,
    status: "Approved" | "Rejected",
    callback?: () => void
  ) => Promise<RequestStatusResponse | undefined>;
  handleAssessRequest: (
    requestId: number,
    callback?: () => void
  ) => Promise<{ isSuccess: boolean; message: string } | undefined>;
  setCompletionFile: (file: File | null) => void;
  handleMarkAsComplete: (
    requestId: number,
    callback?: () => void
  ) => Promise<{ isSuccess: boolean; message: string } | undefined>;
  setRating: (rating: number) => void;
  setHoverRating: (rating: number) => void;
  setFeedback: (feedback: string) => void;
  handleFeedbackSubmit: (
    requestId: number,
    callback?: () => void
  ) => Promise<{ isSuccess: boolean; message: string } | undefined>;
  clearRejectionNote: () => void;
  init: () => Promise<void>;
}

interface CompletionResponse {
  isSuccess: boolean;
  message: string;
}

interface FeedbackResponse {
  isSuccess: boolean;
  message: string;
}

export const useRequestDetailStore = create<RequestDetailState>((set, get) => ({
  request: null,
  userRole: null,
  categories: [],
  selectedCategory: undefined,
  selectedPersonnel: [],
  rejectionNote: "",
  showRejectionDialog: false,
  loading: false,
  isAssessing: false,
  isCompleting: false,
  completionFile: null,
  rating: 0,
  hoverRating: 0,
  feedback: "",
  isSubmittingFeedback: false,

  setRequest: (request) => {
    set({
      request,
      selectedCategory: request.category_id?.toString(),
      selectedPersonnel: request.personnel?.map((p) => p.id) || [],
    });
  },

  fetchUserRole: async () => {
    try {
      const userRole = await secureStorage.get("role");
      set({ userRole });
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  },

  fetchCategories: async () => {
    try {
      set({ loading: true });
      const response = await api.post(
        "/categories",
        {},
        {
          headers: await getAuthHeaders(),
        }
      );
      if (response.data.isSuccess) {
        set({ categories: response.data.categories });
      } else {
        console.error("Failed to fetch categories:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Optionally set an error state here if needed
    } finally {
      set({ loading: false });
    }
  },

  setSelectedCategory: (categoryId) => {
    set({
      selectedCategory: categoryId,
      selectedPersonnel: [], // Reset selected personnel when category changes
    });
  },

  setSelectedPersonnel: (personnelIds) => {
    set({ selectedPersonnel: personnelIds });
  },

  togglePersonnel: (personnelId, isChecked) => {
    const { selectedPersonnel, categories, selectedCategory } = get();

    // Ensure the ID is a number
    const idAsNumber =
      typeof personnelId === "string" ? parseInt(personnelId, 10) : personnelId;

    if (isNaN(idAsNumber)) {
      console.error("Invalid personnel ID:", personnelId);
      return;
    }

    // Find the selected category
    const category = categories.find(
      (cat) => cat.id.toString() === selectedCategory
    );
    if (!category) {
      console.error("Selected category not found");
      return;
    }

    // Find if the personnel is a team lead in the selected category
    const isTeamLead = category.personnel.find(
      (p) => p.id === idAsNumber
    )?.is_team_lead;

    if (isChecked) {
      set({ selectedPersonnel: [...selectedPersonnel, idAsNumber] });
    } else {
      // If unchecking a team lead, show error or handle appropriately
      if (isTeamLead) {
        console.error("Cannot unselect team lead");
        return;
      }
      set({
        selectedPersonnel: selectedPersonnel.filter((id) => id !== idAsNumber),
      });
    }
  },

  setRejectionNote: async (note: string) => {
    try {
      await secureStorage.set("rejectionNote", note);
      set({ rejectionNote: note });
    } catch (error) {
      console.error("Error storing rejection note:", error);
    }
  },

  toggleRejectionDialog: (show) => {
    set({ showRejectionDialog: show });
  },

  handleStatusUpdate: async (requestId, status, callback) => {
    const { rejectionNote } = get();

    if (status === "Rejected" && !rejectionNote.trim()) {
      throw new Error("Please provide a reason for rejection");
    }

    try {
      set({ loading: true });
      if (status === "Rejected") {
        await secureStorage.set("rejectionNote", rejectionNote);
      }

      const response = await updateRequestStatus(requestId, status);

      if (response.isSuccess) {
        // Update local request state
        const { request } = get();
        if (request && response.request) {
          set({
            request: {
              ...request,
              status: response.request.status,
              date_completed:
                status === "Rejected"
                  ? response.request.date_rejected ?? null
                  : request.date_completed,
            },
          });
        }

        if (status === "Rejected") {
          await secureStorage.remove("rejectionNote");
          set({ rejectionNote: "", showRejectionDialog: false });
        }

        callback?.();
        return response;
      }
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  handleAssessRequest: async (requestId, callback) => {
    const { selectedCategory, selectedPersonnel, request, categories } = get();

    // If status is "For Assign", we're assigning personnel, not team lead
    if (request?.status === "For Assign") {
      if (selectedPersonnel.length === 0) {
        throw new Error("Please select at least one personnel");
      }

      try {
        set({ isAssessing: true });
        const token = await secureStorage.get("token");

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/assess/${requestId}`,
          {
            personnel_ids: selectedPersonnel,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.isSuccess && request) {
          // Update local request state
          set({
            request: {
              ...request,
              personnel: selectedPersonnel.map((id) => ({
                id,
                name: "", // This will be updated when the page refreshes
                is_team_lead: false,
              })),
              status: "In Progress",
            },
          });

          callback?.();
          return response.data;
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          throw new Error(
            error.response.data.message || "Error assigning personnel"
          );
        }
        throw error;
      } finally {
        set({ isAssessing: false });
      }
    } else {
      // Initial team lead assignment
      if (!selectedCategory) {
        throw new Error("Please select a category");
      }

      const category = categories.find(
        (cat) => cat.id.toString() === selectedCategory
      );
      if (!category) {
        throw new Error("Selected category not found");
      }

      // Find the selected team lead from the selected personnel
      const selectedTeamLead = category.personnel.find(
        (p) => p.is_team_lead && selectedPersonnel.includes(p.id)
      );

      if (!selectedTeamLead) {
        throw new Error("Please select a team lead");
      }

      try {
        set({ isAssessing: true });
        const token = await secureStorage.get("token");

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/assign/${requestId}`,
          {
            category_id: Number(selectedCategory),
            team_lead_id: selectedTeamLead.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.isSuccess && request) {
          // Update local request state with all required properties
          set({
            request: {
              ...request,
              category_id: Number(selectedCategory),
              category_name: category.category_name,
              team_lead: {
                id: selectedTeamLead.id,
                first_name: selectedTeamLead.name.split(" ")[0],
                last_name: selectedTeamLead.name.split(" ")[1] || "",
              },
              status: "For Assign",
            },
          });

          callback?.();
          return response.data;
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          throw new Error(
            error.response.data.message || "Error assigning team lead"
          );
        }
        throw error;
      } finally {
        set({ isAssessing: false });
      }
    }
  },

  setCompletionFile: (file) => {
    set({ completionFile: file });
  },

  handleMarkAsComplete: async (
    requestId: number,
    callback?: () => void
  ): Promise<CompletionResponse | undefined> => {
    const { completionFile } = get();
    if (!completionFile) {
      throw new Error("Please upload a completion file");
    }

    try {
      set({ isCompleting: true });
      const formData = new FormData();
      formData.append("file_completion", completionFile);

      const token = await secureStorage.get("token");
      const response = await axios.post<CompletionResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/completion/${requestId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.isSuccess) {
        callback?.();
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(
          error.response.data.message || "Error completing request"
        );
      }
      throw error;
    } finally {
      set({ isCompleting: false });
    }
  },

  setRating: (rating) => {
    set({ rating });
  },

  setHoverRating: (rating) => {
    set({ hoverRating: rating });
  },

  setFeedback: (feedback) => {
    set({ feedback });
  },

  handleFeedbackSubmit: async (
    requestId: number,
    callback?: () => void
  ): Promise<FeedbackResponse | undefined> => {
    const { rating, feedback } = get();

    if (!rating) {
      throw new Error("Please provide a rating");
    }

    try {
      set({ isSubmittingFeedback: true });
      const token = await secureStorage.get("token");
      const response = await axios.post<FeedbackResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/request/feedback/${requestId}`,
        { rating, feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isSuccess) {
        // Update local request state
        const { request } = get();
        if (request) {
          set({
            request: {
              ...request,
              rating,
              feedback,
              status: "Completed",
            },
          });
        }
        callback?.();
        return response.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(
          error.response.data.message || "Error submitting feedback"
        );
      }
      throw error;
    } finally {
      set({ isSubmittingFeedback: false });
    }
  },

  clearRejectionNote: async () => {
    try {
      await secureStorage.remove("rejectionNote");
      set({ rejectionNote: "" });
    } catch (error) {
      console.error("Error clearing rejection note:", error);
    }
  },

  init: async () => {
    try {
      const storedNote = await secureStorage.get("rejectionNote");
      if (storedNote) {
        set({ rejectionNote: storedNote });
      }
    } catch (error) {
      console.error("Error initializing store:", error);
    }
  },
}));
