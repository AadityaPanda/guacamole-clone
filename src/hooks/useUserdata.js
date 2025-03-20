import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useUserData = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const dataSource = "mysql";
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("authToken");

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !username) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${baseURL}/api/session/data/${dataSource}/users/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "guacamole-token": `${token}`,
            }
          });
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("User data fetch error:", error);
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [baseURL, dataSource, username, token]);

  return { userData, loading };
};