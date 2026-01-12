import React, { createContext, useState, useContext } from 'react';

// 1. Create the context with a default value of null
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 2. Export the hook to use it in screens
export const useAuth = () => useContext(AuthContext);