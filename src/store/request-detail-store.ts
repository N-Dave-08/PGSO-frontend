import { create } from "zustand";
import { Request, RequestStatusResponse } from "@/types";
import { updateRequestStatus, assessRequest } from "@/lib/api/requests";
import axios from "axios";
import { secureStorage } from "@/lib/utils/encryption";
import { Category } from "@/types/categories";

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
  fetchUserRole: () => void;
  fetchCategories: () => Promise<void>;
  setSelectedCategory: (categoryId: string | undefined) => void;
  setSelectedPersonnel: (personnelIds: number[]) => void;
  togglePersonnel: (personnelId: number, isChecked: boolean) => void;
  setRejectionNote: (note: string) => void;
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
  ) => Promise<any>;
  setRating: (rating: number) => void;
  setHoverRating: (rating: number) => void;
  setFeedback: (feedback: string) => void;
  handleFeedbackSubmit: (
    requestId: number,
    callback?: () => void
  ) => Promise<any>;
  clearRejectionNote: () => void;
  init: () => Promise<void>;
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
      const token = await secureStorage.get("token");
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/dropdown/categories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.isSuccess) {
        set({ categories: data.categories });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  },

  setSelectedCategory: (categoryId) => {
    set({ selectedCategory: categoryId });
  },

  setSelectedPersonnel: (personnelIds) => {
    set({ selectedPersonnel: personnelIds });
  },

  togglePersonnel: (personnelId, isChecked) => {
    const { selectedPersonnel } = get();

    // Ensure the ID is a number
    const idAsNumber =
      typeof personnelId === "string" ? parseInt(personnelId, 10) : personnelId;

    if (isNaN(idAsNumber)) {
      console.error("Invalid personnel ID:", personnelId);
      return;
    }

    if (isChecked) {
      set({ selectedPersonnel: [...selectedPersonnel, idAsNumber] });
    } else {
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
    const { selectedCategory, selectedPersonnel } = get();

    if (!selectedCategory) {
      throw new Error("Please select a category");
    }

    if (selectedPersonnel.length === 0) {
      throw new Error("Please select at least one personnel");
    }

    try {
      set({ isAssessing: true });

      // Make sure category_id is a valid number
      const categoryId = parseInt(selectedCategory, 10);

      if (isNaN(categoryId)) {
        throw new Error("Invalid category ID");
      }

      const response = await assessRequest(requestId, {
        category_id: categoryId,
        personnel_ids: selectedPersonnel,
      });

      if (response.isSuccess) {
        callback?.();
        return response;
      }
    } catch (error) {
      throw error;
    } finally {
      set({ isAssessing: false });
    }
  },

  setCompletionFile: (file) => {
    set({ completionFile: file });
  },

  handleMarkAsComplete: async (requestId, callback) => {
    const { completionFile } = get();

    if (!completionFile) {
      throw new Error("Please select a completion file");
    }

    try {
      set({ isCompleting: true });
      const formData = new FormData();
      formData.append("file_completion", completionFile);

      const token = await secureStorage.get("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pro/request/completion/${requestId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        callback?.();
        return response.data;
      }
    } catch (error) {
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

  handleFeedbackSubmit: async (requestId, callback) => {
    const { rating, feedback } = get();

    if (rating === 0) {
      throw new Error("Please provide a rating");
    }

    try {
      set({ isSubmittingFeedback: true });

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/requests/feedback",
        {
          request_id: requestId,
          feedback,
          rating,
        }
      );

      if (response.data.isSuccess) {
        callback?.();
        return response.data;
      }
    } catch (error) {
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
