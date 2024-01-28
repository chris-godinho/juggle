// LayoutProvider.js

import React, { createContext, useState, useContext } from "react";

const LayoutContext = createContext();

const LayoutProvider = ({ children }) => {
  const [layout, setLayout] = useState(() => {
    const storedLayout = localStorage.getItem('layout');
    return storedLayout || 'two-sidebars';
  });

  const changeLayout = (newLayout) => {
    setLayout((prevScheme) => {
        const newScheme = newLayout ? newLayout : prevScheme;
        localStorage.setItem('layout', newScheme);
        return newScheme;
      });
  };

  return (
    <LayoutContext.Provider value={{ layout, changeLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};

const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

export { LayoutProvider, useLayout };
