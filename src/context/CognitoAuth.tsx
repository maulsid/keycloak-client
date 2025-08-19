
// for local storage remove below commented code

// import React, { createContext, useContext, useEffect, useState,  } from 'react';

// // Cognito configuration
// const COGNITO_CONFIG = {
//   clientId: import.meta.env.VITE_COGINTO_CLIENT_ID ,
//   redirectUri: import.meta.env.VITE_COGNITO_REDIRECT_URI, 
//   cognitoDomain: import.meta.env.VITE_COGNITO_DOMAIN,
//   logoutRedirectUri: import.meta.env.VITE_COGNITO_LOGOUT_REDIRECT_URI,
// };

// // Auth context type
// interface AuthContextType {
//   isAuthenticated: boolean;
//   token: string | null;
//   login: () => Promise<void>;
//   logout: () => void;
// }

// // Token response type
// interface TokenResponse {
//   access_token: string;
//   refresh_token: string;
//   id_token: string;
//   expires_in: number;
//   token_type: string;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Utility to generate a random string for code_verifier
// const generateRandomString = (length: number): string => {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   const cryptoRandom = crypto.getRandomValues(new Uint8Array(length));
//   return Array.from(cryptoRandom)
//     .map((value) => characters[value % characters.length])
//     .join('');
// };

// // Utility to generate code_challenge from code_verifier
// const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
//   const encoder = new TextEncoder();
//   const data = encoder.encode(codeVerifier);
//   const digest = await crypto.subtle.digest('SHA-256', data);
//   return btoa(String.fromCharCode(...new Uint8Array(digest)))
//     .replace(/\+/g, '-')
//     .replace(/\//g, '_')
//     .replace(/=+$/, '');
// };

// // AuthProvider component
// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
//     !!localStorage.getItem('access_token')
//   );
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
//   const [refreshToken, setRefreshToken] = useState<string | null>(
//     localStorage.getItem('refresh_token')
//   );

//   useEffect(() => {
//     // Handle logout redirect
//     if (window.location.pathname === '/logged-out') {
//       localStorage.removeItem('refresh_token');
//       localStorage.removeItem('id_token');
//       localStorage.removeItem('code_verifier');
//       setIsAuthenticated(false);
//       setToken(null);
//       setRefreshToken(null);
//       return;
//     }

//     // Handle authorization code redirect
//     const handleAuthCode = async () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const code = urlParams.get('code');
//       if (code) {
//         try {
//           const codeVerifier = localStorage.getItem('code_verifier');
//           if (!codeVerifier) {
//             console.error('No code verifier found');
//             setIsAuthenticated(false);
//             setToken(null);
//             setRefreshToken(null);
//             localStorage.removeItem('refresh_token');
//             localStorage.removeItem('id_token');
//             return;
//           }

//           // Exchange code for tokens
//           const response = await fetch(`${COGNITO_CONFIG.cognitoDomain}/oauth2/token`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/x-www-form-urlencoded',
//               'Accept': '*/*',
//             },
//             body: new URLSearchParams({
//               grant_type: 'authorization_code',
//               client_id: COGNITO_CONFIG.clientId,
//               code,
//               redirect_uri: COGNITO_CONFIG.redirectUri,
//               code_verifier: codeVerifier,
//             }),
//           });

//           if (!response.ok) {
//             throw new Error('Token exchange failed');
//           }

//           const data: TokenResponse = await response.json();
//           console.log('ttt2', data);
//           localStorage.setItem('token', data.access_token);
//           localStorage.setItem('refresh_token', data.refresh_token);
//           localStorage.setItem('id_token', data.id_token);
//           localStorage.setItem('access_token', data.access_token);
//           setToken(data.access_token);
//           setRefreshToken(data.refresh_token);
//           setIsAuthenticated(true);

//           // Clear query parameters
//           window.history.replaceState({}, document.title, window.location.pathname);
//         } catch (err: unknown) {
//           console.error('Token exchange error:', err);
//           setIsAuthenticated(false);
//           setToken(null);
//           setRefreshToken(null);
//           localStorage.removeItem('refresh_token');
//           localStorage.removeItem('id_token');
//         }
//       }
//     };

//     handleAuthCode();

//     // Periodic token refresh
//     const interval = setInterval(async () => {
//       if (isAuthenticated && refreshToken) {
//         try {
//           const response = await fetch(`${COGNITO_CONFIG.cognitoDomain}/oauth2/token`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/x-www-form-urlencoded',
//               'Accept': '*/*',
//             },
//             body: new URLSearchParams({
//               grant_type: 'refresh_token',
//               client_id: COGNITO_CONFIG.clientId,
//               refresh_token: refreshToken,
//             }),
//           });

//           if (!response.ok) {
//             throw new Error('Token refresh failed');
//           }

//           const data: TokenResponse = await response.json();
//           console.log('ttt', data);
//           localStorage.setItem('token', data.access_token);
//           localStorage.setItem('id_token', data.id_token);
//           localStorage.setItem('access_token', data.access_token);
//           setToken(data.access_token);
//           setIsAuthenticated(true);
//         } catch (err: unknown) {
//           console.error('Token refresh error:', err);
//           setIsAuthenticated(false);
//           setToken(null);
//           setRefreshToken(null);
//           localStorage.removeItem('refresh_token');
//           localStorage.removeItem('id_token');
//         }
//       }
//     }, 300000); // Refresh every 5 minutes

//     return () => clearInterval(interval);
//   }, [isAuthenticated, refreshToken]);

//   const login = async (): Promise<void> => {
//     try {
//       const codeVerifier = generateRandomString(128);
//       localStorage.setItem('code_verifier', codeVerifier);
//       const codeChallenge = await generateCodeChallenge(codeVerifier);
//       const authUrl = `${COGNITO_CONFIG.cognitoDomain}/oauth2/authorize?response_type=code&client_id=${
//         COGNITO_CONFIG.clientId
//       }&redirect_uri=${encodeURIComponent(COGNITO_CONFIG.redirectUri)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
//       window.location.href = authUrl;
//     } catch (err: unknown) {
//       console.error('Error initiating login:', err);
//     }
//   };

// const logout = (): void => {
//   localStorage.removeItem('refresh_token');
//   localStorage.removeItem('id_token');
//   localStorage.removeItem('code_verifier');
//   localStorage.removeItem('access_token');
//   setIsAuthenticated(false);
//   setToken(null);
//   setRefreshToken(null);
// const logoutUrl = `${COGNITO_CONFIG.cognitoDomain}/logout?client_id=${
//   COGNITO_CONFIG.clientId
// }&redirect_uri=${COGNITO_CONFIG.logoutRedirectUri}`;
// window.location.href = logoutUrl;

// };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



import React, { createContext, useContext, useEffect, useState } from 'react';

// Cognito configuration
const COGNITO_CONFIG = {
  clientId: import.meta.env.VITE_COGINTO_CLIENT_ID,
  redirectUri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  cognitoDomain: import.meta.env.VITE_COGNITO_DOMAIN,
  logoutRedirectUri: import.meta.env.VITE_COGNITO_LOGOUT_REDIRECT_URI,
};

// Auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  idToken: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

// Token response type
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility to generate a random string for code_verifier
const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const cryptoRandom = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(cryptoRandom)
    .map((value) => characters[value % characters.length])
    .join('');
};

// Utility to generate code_challenge from code_verifier
const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Utility to encode code_verifier for state parameter
const encodeCodeVerifier = (codeVerifier: string): string => {
  return btoa(codeVerifier).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// Utility to decode code_verifier from state parameter
const decodeCodeVerifier = (encoded: string): string => {
  return atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
};


// AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    // Handle logout redirect
    if (window.location.pathname === '/logged-out') {
      setIsAuthenticated(false);
      setToken(null);
      setRefreshToken(null);
      setIdToken(null);
      return;
    }

    // Handle authorization code redirect
    const handleAuthCode = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      if (code && state) {
        try {
          const codeVerifier = decodeCodeVerifier(state);
          if (!codeVerifier) {
            console.error('No code verifier found in state parameter');
            setIsAuthenticated(false);
            setToken(null);
            setRefreshToken(null);
            setIdToken(null);
            return;
          }

          // Exchange code for tokens
          const response = await fetch(`${COGNITO_CONFIG.cognitoDomain}/oauth2/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': '*/*',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: COGNITO_CONFIG.clientId,
              code,
              redirect_uri: COGNITO_CONFIG.redirectUri,
              code_verifier: codeVerifier,
            }),
          });

          if (!response.ok) {
            throw new Error('Token exchange failed');
          }

          const data: TokenResponse = await response.json();
          setToken(data.access_token);
          setRefreshToken(data.refresh_token);
          setIdToken(data.id_token);
          setIsAuthenticated(true);

          // Clear query parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err: unknown) {
          console.error('Token exchange error:', err);
          setIsAuthenticated(false);
          setToken(null);
          setRefreshToken(null);
          setIdToken(null);
        }
      }
    };

    handleAuthCode();

    // Periodic token refresh
    const interval = setInterval(async () => {
      if (isAuthenticated && refreshToken) {
        try {
          const response = await fetch(`${COGNITO_CONFIG.cognitoDomain}/oauth2/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': '*/*',
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              client_id: COGNITO_CONFIG.clientId,
              refresh_token: refreshToken,
            }),
          });

          if (!response.ok) {
            throw new Error('Token refresh failed');
          }

          const data: TokenResponse = await response.json();
          setToken(data.access_token);
          setIdToken(data.id_token);
          setIsAuthenticated(true);
        } catch (err: unknown) {
          console.error('Token refresh error:', err);
          setIsAuthenticated(false);
          setToken(null);
          setRefreshToken(null);
          setIdToken(null);
        }
      }
    }, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshToken]);

  const login = async (): Promise<void> => {
    try {
      const codeVerifier = generateRandomString(128);
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const encodedCodeVerifier = encodeCodeVerifier(codeVerifier);
      const authUrl = `${COGNITO_CONFIG.cognitoDomain}/oauth2/authorize?response_type=code&client_id=${
        COGNITO_CONFIG.clientId
      }&redirect_uri=${encodeURIComponent(COGNITO_CONFIG.redirectUri)}&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${encodedCodeVerifier}`;
      window.location.href = authUrl;
    } catch (err: unknown) {
      console.error('Error initiating login:', err);
    }
  };

  const logout = (): void => {
    setIsAuthenticated(false);
    setToken(null);
    setRefreshToken(null);
    setIdToken(null);
    const logoutUrl = `${COGNITO_CONFIG.cognitoDomain}/logout?client_id=${
      COGNITO_CONFIG.clientId
    }&logout_uri=${COGNITO_CONFIG.logoutRedirectUri}`;    
    window.location.href = logoutUrl;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, refreshToken, idToken, login, logout }}>
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
