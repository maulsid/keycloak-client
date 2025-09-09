import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/CognitoAuth";
import { useEffect } from "react";
import { Loading } from "../../components/common/Loading";

// Interface for JWT payload
interface IdTokenPayload {
  role?: string;
  sub: string;
  email?: string;
}

// Utility to decode JWT (id_token) payload
const decodeJwt = (token: string): IdTokenPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Error decoding JWT:", err);
    return null;
  }
};

// Callback component
const Callback: React.FC = () => {
  const { isAuthenticated, token ,logout} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      if (isAuthenticated && token) {
        const payload = decodeJwt(token);
        if (!payload) {
          console.error("Invalid id_token");
          return;
        }

        const role = payload["role"] || "";
        const customerId = payload["sub"];
        console.log("role", customerId,role);

        if (role.includes("admin")) {
          navigate("/admin/dashboard");
        } else if (role.includes("hcp")) {
          navigate("/customer/dashboard");
        } else {  
          logout();
          console.error("User has no recognized role");
          navigate("/login");
        }
      }
    };

    handleCallback();
  }, [isAuthenticated, token, navigate]);

  return <Loading />;
};

export default Callback;
