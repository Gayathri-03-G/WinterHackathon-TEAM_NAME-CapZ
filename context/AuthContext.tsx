import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('@user_data');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.log("Failed to load user", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Modified save function
  const saveUser = async (userData: any) => {
    try {
      if (userData) {
        await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem('@user_data');
      }
      setUser(userData);
    } catch (e) {
      console.log("Save error", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: saveUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);