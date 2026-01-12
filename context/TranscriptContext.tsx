import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context
const TranscriptContext = createContext<any>(null);

// 2. Create a Provider to wrap your app
export const TranscriptProvider = ({ children }: { children: React.ReactNode }) => {
  const [transcript, setTranscript] = useState(""); // This stores your recorded text

  return (
    <TranscriptContext.Provider value={{ transcript, setTranscript }}>
      {children}
    </TranscriptContext.Provider>
  );
};

// 3. Create a custom hook to use it easily
export const useTranscript = () => useContext(TranscriptContext);