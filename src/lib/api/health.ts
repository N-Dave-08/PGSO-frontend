export const checkApiHealth = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/health`
    );
    return response.ok;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
};
