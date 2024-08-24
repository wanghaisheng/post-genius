import React, { createContext, useContext, useState } from 'react';

const QueryVariablesContext = createContext();

export const QueryVariablesProvider = ({ children }) => {
  const [queryVariables, setQueryVariables] = useState({});

  return (
    <QueryVariablesContext.Provider value={{ queryVariables, setQueryVariables }}>
      {children}
    </QueryVariablesContext.Provider>
  );
};

export const useQueryVariables = () => useContext(QueryVariablesContext);