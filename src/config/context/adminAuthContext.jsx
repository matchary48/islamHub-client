import { createContext, useEffect, useReducer } from "react";

export const AdminAuthContext = createContext();

const adminAuthReducer = (state, action) => {
  switch (action.type) {
    case "ADMIN_LOGIN":
      return { adminToken: action.payload, role: "admin", isLoading: false };
    case "ADMIN_LOGOUT":
      return { adminToken: null, role: null, isLoading: false };
    default:
      return state;
  }
};

export const AdminAuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminAuthReducer, {
    adminToken: null,
    role: null,
    isLoading: true,
  });

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const userItem = localStorage.getItem("role");

    if (adminToken && userItem) {
      try {
        if (userItem === "admin") {
          dispatch({ type: "ADMIN_LOGIN", payload: adminToken });
        } else {
          dispatch({ type: "ADMIN_LOGOUT" });
        }
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
        dispatch({ type: "ADMIN_LOGOUT" });
      }
    } else {
      dispatch({ type: "ADMIN_LOGOUT" });
    }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ ...state, dispatch }}>
      {state.isLoading ? <div>Loading...</div> : children}
    </AdminAuthContext.Provider>
  );
};
