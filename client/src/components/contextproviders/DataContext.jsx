// DataContext.js
// Allows general data sharing across the component tree

import { createContext, useContext } from 'react';

const DataContext = createContext();

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
      throw new Error('useDataContext must be used within a DataContext.Provider');
    }

    return context;
  };

export default DataContext;
