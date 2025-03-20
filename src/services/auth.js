export const loginUser = async (username, password) => {
  const baseURL = import.meta.env.VITE_BASE_URL;

  try {
    const response = await fetch(`${baseURL}/api/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
    });

    const { authToken, dataSource, availableDataSource } = await response.json();

    return { authToken, dataSource, availableDataSource };

  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};