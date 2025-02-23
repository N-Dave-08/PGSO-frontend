import axios from "axios";

export const getUsers = async () => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/admin/users"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
