import React, { createContext, useContext, useEffect, useState } from 'react';
import keycloak from '../keycloak';

let isKeycloakInitialized = false;

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (window.location.pathname === '/logged-out') return;

    if (!isKeycloakInitialized) {
      isKeycloakInitialized = true;

      keycloak
        .init({
          onLoad: 'check-sso',
        })
        .then((authenticated) => {
          setIsAuthenticated(authenticated);
          setToken(keycloak.token || null);
        })
        .catch((err) => {
          console.error('Keycloak init failed:', err);
        });
    }
  }, []);

  const login = () => {
    keycloak.login({ redirectUri: window.location.origin + '/dashboard' });
  };

  const logout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};