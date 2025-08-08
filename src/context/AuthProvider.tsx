import React, { createContext, useContext, useEffect, useState } from 'react';
import keycloak from '../config/keycloak';

let isKeycloakInitialized = false;

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token')); // Initialize based on token presence
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (window.location.pathname === '/logged-out') {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setToken(null);
      return;
    }

    const initKeycloak = async () => {
      try {
        if (!isKeycloakInitialized) {
          isKeycloakInitialized = true;
          const authenticated = await keycloak.init({ 
            onLoad: 'check-sso',
            checkLoginIframe: false,
            token: localStorage.getItem('token') || undefined, // Pass stored token to Keycloak
          });
          setIsAuthenticated(authenticated);
          setToken(keycloak.token || null);
          if (authenticated && keycloak.token) {
            localStorage.setItem('token', keycloak.token);
          } else {
            localStorage.removeItem('token');
          }
        }

        keycloak.onAuthSuccess = () => {
          setIsAuthenticated(true);
          setToken(keycloak.token || null);
          if (keycloak.token) {
            localStorage.setItem('token', keycloak.token);
          }
        };

        keycloak.onAuthRefreshSuccess = () => {
          setToken(keycloak.token || null);
          if (keycloak.token) {
            localStorage.setItem('token', keycloak.token);
          }
        };

        keycloak.onAuthError = (err) => {
          console.error('Keycloak auth error:', err);
          setIsAuthenticated(false);
          setToken(null);
          localStorage.removeItem('token');
        };

        keycloak.onAuthLogout = () => {
          setIsAuthenticated(false);
          setToken(null);
          localStorage.removeItem('token');
        };

        // Validate token periodically
        keycloak.onTokenExpired = () => {
          keycloak.updateToken(30).catch((err) => {
            console.error('Token refresh failed:', err);
            setIsAuthenticated(false);
            setToken(null);
            localStorage.removeItem('token');
          });
        };
      } catch (err) {
        console.error('Keycloak init failed:', err);
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem('token');
      }
    };

    initKeycloak();

    // Optional: Periodic token validation
    const interval = setInterval(() => {
      if (keycloak.authenticated && keycloak.token) {
        setIsAuthenticated(true);
        setToken(keycloak.token);
        localStorage.setItem('token', keycloak.token);
      } else {
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem('token');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const login = () => {
    keycloak.login({ redirectUri: window.location.origin + '/dashboard' });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('token');
    keycloak.logout({ redirectUri: window.location.origin + '/logged-out' });
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