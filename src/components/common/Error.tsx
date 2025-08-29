// Error Component
interface ErrorProps {
  message?: string;
}

export const Error: React.FC<ErrorProps> = ({
  message = "Failed to load dashboard",
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <p className="text-red-600">{message}</p>
    </div>
  </div>
);
