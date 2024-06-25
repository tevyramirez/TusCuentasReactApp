import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  authTokens: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authTokens, setAuthTokens] = useState<string | null>(() => localStorage.getItem('token'));

  const login = (token: string) => {
    setAuthTokens(token);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setAuthTokens(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ authTokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
