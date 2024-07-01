import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAdminAuthContext } from "../context/useAdminAuthContext";

export const useAdminLogin = (toast) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAdminAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/login",
        {
          email,
          password,
        }
      );
      if (response.data.status_code === 200) {
        navigate("/admin/dashboard");
        const user = response.data.data;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        document.cookie = `userData=${JSON.stringify(
          user
        )}; expires=${expirationDate.toUTCString()}`;

        const role = response.data.data.role;

        const adminToken = response.data.token;
        localStorage.setItem("adminToken", adminToken);
        localStorage.setItem("role", role);
        dispatch({ type: "ADMIN_LOGIN", payload: adminToken });

        toast({
          title: "Admin berhasil login",
          status: "success",
          position: "top",
          isClosable: true,
        });
      } else {
        console.log("login gagal");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        console.log("No response received from server:", error.request);
      } else {
        console.log("Request error:", error.message);
      }
    }
  };

  return { login, isLoading, error };
};
