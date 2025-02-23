import axios from "axios";

export interface CreateDivisionRequest {
  division_name: string;
  office_location: string;
  staff: Array<{
    id: number;
    name: string;
    position: string;
  }>;
  category_id: number;
  department_id: number;
}

export const createDivision = async (data: CreateDivisionRequest) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }
    console.log("Creating division with data:", data);
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/division/create",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: data,
      });
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Division creation failed: ${errorMessage}`);
    }
    // Handle non-axios errors
    const err = error as Error;
    throw new Error(`Division creation failed: ${err.message}`);
  }
};

export const getDivisions = async () => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/divisions"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching divisions:", error);
      throw error;
    }
    // Handle non-axios errors
    const err = error as Error;
    throw new Error(`Failed to fetch divisions: ${err.message}`);
  }
};
