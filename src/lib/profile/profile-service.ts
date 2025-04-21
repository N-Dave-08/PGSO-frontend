import axios, { AxiosError } from "axios";
import { secureStorage } from "@/lib/utils/encryption";
import { LoginUser } from "@/types/auth";

interface ProfileUpdatePayload {
  first_name: string;
  last_name: string;
  email: string;
  number?: string | null | undefined;
  age?: string;
  gender?: string;
  current_password: string;
}

export interface ProfileUpdateResponse {
  isSuccess: boolean;
  message: string;
  user?: Partial<LoginUser>;
}

interface ApiErrorResponse {
  message: string;
}

export async function updateUserProfile(
  values: ProfileUpdatePayload,
  updateUserFn: (userData: Partial<LoginUser>) => Promise<void>
): Promise<void> {
  try {
    // Get token from storage
    const token = await secureStorage.get("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Format the payload to match the expected format
    const payload: ProfileUpdatePayload = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      number: values.number || "",
      age: values.age,
      gender: values.gender,
      current_password: values.current_password,
    };

    // Call the API endpoint to update profile details
    const response = await axios.post<ProfileUpdateResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/changeprofile`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { isSuccess, message, user } = response.data;

    if (isSuccess && user) {
      // Update the user in the auth context using the updateUser method
      await updateUserFn(user);
      return;
    } else {
      // Return the specific error message from the API
      throw new Error(message || "Unknown error occurred");
    }
  } catch (error) {
    // Handle Axios error responses
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data) {
        throw new Error(
          axiosError.response.data.message || "Error updating profile"
        );
      }
    }

    throw error;
  }
}
