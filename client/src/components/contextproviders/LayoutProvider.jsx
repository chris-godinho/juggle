// LayoutProvider.js
// Provides support for dashboard layout changes

import React, { createContext, useState, useContext } from "react";

const LayoutContext = createContext();

const LayoutProvider = ({ children }) => {
  // Get the stored layout from local storage, or use the default
  const [layout, setLayout] = useState(() => {
    const storedLayout = localStorage.getItem("layout");
    return storedLayout || "two-sidebars";
  });

  const [eventView, setEventView] = useState(() => {
    const storedEventView = localStorage.getItem("eventView");
    return storedEventView || "calendar";
  });

  const changeLayout = (newLayout) => {
    setLayout((prevScheme) => {
      const newScheme = newLayout ? newLayout : prevScheme;
      // Use local storage as a backup for the user's layout preference
      localStorage.setItem("layout", newScheme);
      return newScheme;
    });
  };

  const changeEventView = (newEventView) => {
    setEventView((prevView) => {
      const newView = newEventView ? newEventView : prevView;
      localStorage.setItem("eventView", newView);
      return newView;
    });
  };

  return (
    <LayoutContext.Provider
      value={{ layout, changeLayout, eventView, changeEventView }}
    >
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
