import React, { createContext, useContext, useState } from "react";

// User Context for managing customer authentication and data
const UserContext = createContext();

// User Provider Component
export const UserProvider = ({ children }) => {
  // For now, default to customer_id 1 for testing
  // Later this will come from authentication
  const [customerId, setCustomerId] = useState(1);
  const [userName, setUserName] = useState("Test User");

  const login = (id, name) => {
    setCustomerId(id);
    setUserName(name);
  };

  const logout = () => {
    setCustomerId(1); // Reset to test user
    setUserName("Test User");
  };

  return (
    <UserContext.Provider
      value={{
        customerId,
        userName,
        login,
        logout,
        setCustomerId,
        setUserName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook to use user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
