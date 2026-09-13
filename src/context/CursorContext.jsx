import React, { createContext, useContext, useState } from 'react';

const CursorContext = createContext(undefined);

export function CursorProvider({ children }) {
  const [cursorType, setCursorType] = useState('default');
  const [cursorText, setCursorText] = useState('');

  const value = {
    cursorType,
    setCursorType,
    cursorText,
    setCursorText,
  };

  return (
    <CursorContext.Provider value={value}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
}
