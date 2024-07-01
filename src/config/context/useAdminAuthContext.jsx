import { useContext } from "react";
import { AdminAuthContext } from "./adminAuthContext";

export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error(
      "useAdminAuthContext must be used within an AdminAuthContextProvider"
    );
  }
  return context;
};
