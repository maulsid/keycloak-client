// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/CognitoAuth';

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/CognitoAuth";
import { useEffect } from "react";
import { Loading } from "../../components/common/Loading";

// Interface for JWT payload
interface IdTokenPayload {
  'custom:role'?: string;
  sub: string;
  email?: string;
}

// Utility to decode JWT (id_token) payload
const decodeJwt = (token: string): IdTokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Error decoding JWT:', err);
    return null;
  }
};

//for local storage remove below commented code

// const Callback: React.FC = () => {
//   const { isAuthenticated, token } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleCallback = async () => {
//       if (isAuthenticated ) {
//         const accessToken = localStorage.getItem('access_token');
//         if (!accessToken) {
//           console.error('No id_token found');
//           // navigate('/login');
//           return;
//         }

//         const payload = decodeJwt(accessToken);
//         console.log('aaa', payload);

//         if (!payload) {
//           console.error('Invalid id_token');
//           // navigate('/login');
//           return;
//         }

//         const role = payload['custom:role'] || '';
//         if (role.includes('admin')) {
//           navigate('/admin/dashboard');
//         } else if (role.includes('customer')) {
//           navigate('/customer/dashboard');
//         } else {
//           console.error('User has no recognized role');
//           navigate('/login');
//         }
//       } 
//     };

//     handleCallback();
//   }, [isAuthenticated, token, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h1 className="text-2xl font-bold">Processing login...</h1>
//         <p>Please wait while we authenticate your session.</p>
//       </div>
//     </div>
//   );
// };

// export default Callback;


// Callback component
const Callback: React.FC = () => {
  const { isAuthenticated, idToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      if (isAuthenticated && idToken) {
        const payload = decodeJwt(idToken);
        console.log('aaa', payload);

        if (!payload) {
          console.error('Invalid id_token');
          return;
        }

        const role = payload['custom:role'] || '';
        console.log("role", role);

        if (role.includes('admin')) {
          navigate('/admin/dashboard');
        } else if (role.includes('customer')) {
          navigate('/customer/dashboard');
        } else {
          console.error('User has no recognized role');
          navigate('/login');
        }
      }
    };

    handleCallback();
  }, [isAuthenticated, idToken, navigate]);

  return (
    <Loading />
  );
};

export default Callback;