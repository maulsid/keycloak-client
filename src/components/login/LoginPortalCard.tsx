import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/CognitoAuth";
import type { LoginPortalCardProps } from "../../types";
import LoginFeatureCard from "./LoginFeatureCard";
import { useEffect } from "react";

const LoginPortalCard: React.FC<LoginPortalCardProps> = ({
  title,
  icon,
  description,
  features,
  buttonText,
  buttonLink,
  buttonColor,
}) => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`${buttonLink}`, { replace: true });
    }
  }, [isAuthenticated, navigate, buttonLink]);
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex items-center mb-6">
        {icon}
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {features.map((feature, index) => (
          <LoginFeatureCard key={index} {...feature} />
        ))}
      </div>
      <a
        href={buttonLink}
        className={`inline-flex items-center px-6 py-3 ${buttonColor} text-white font-semibold rounded-lg hover:opacity-90 transition-colors`}
        onClick={login}
      >
        {buttonText}
        <svg
          className="ml-2 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </a>
    </div>
  );
};

export default LoginPortalCard;
