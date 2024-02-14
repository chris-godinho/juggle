// ColorSchemeProvider.js
// Provides support for colour scheme changes

import React, { createContext, useState, useContext } from "react";

const ColorSchemeContext = createContext();

const ColorSchemeProvider = ({ children }) => {
  // Get the stored color scheme from local storage, or use the default
  const [colorScheme, setColorScheme] = useState(() => {
    const storedColorScheme = localStorage.getItem('colorScheme');
    return storedColorScheme || 'default-mode-jg';
  });

  const changeColorScheme = (newColorScheme) => {
    setColorScheme((prevScheme) => {
        const newScheme = newColorScheme ? newColorScheme : prevScheme;
        // Use local storage as a backup for the user's colour scheme preference
        localStorage.setItem('colorScheme', newScheme);
        return newScheme;
      });
  };

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, changeColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

const useColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error("useColorScheme must be used within a ColorSchemeProvider");
  }
  return context;
};

export { ColorSchemeProvider, useColorScheme };
