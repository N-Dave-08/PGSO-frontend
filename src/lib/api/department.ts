import axios from "axios";

export const getDepartments = async () => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/admin/department"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching divisions:", error);
    throw error;
  }
};

export const createDepartment = async (departmentName: string, acronym: string, divisionIds: number[]) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/admin/department/create",
      {
        department_name: departmentName,
        acronym,
        division_id: divisionIds,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
