import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { token: action.payload, isLoading: false };
    case "LOGOUT":
      return { token: null, isLoading: false };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch({ type: "LOGIN", payload: token });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {state.isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
