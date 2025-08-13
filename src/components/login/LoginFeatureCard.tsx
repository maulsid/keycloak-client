import type { LoginFeatureCardProps } from "../../types";

// Feature Card Component
const LoginFeatureCard: React.FC<LoginFeatureCardProps> = ({ bgColor, textColor, borderColor, title, description }) => (
  <div className={`${bgColor} p-4 rounded-lg ${borderColor}`}>
    <h3 className={`font-semibold ${textColor} mb-2`}>{title}</h3>
    <p className={`text-sm ${textColor.replace('900', '700')}`}>{description}</p>
  </div>
);

export default LoginFeatureCard;