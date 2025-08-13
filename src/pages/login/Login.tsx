import LoginHeader from '../../components/login/LoginHeader';
import LoginFooter from '../../components/login/LoginFooter';
import LoginPortalCard from '../../components/login/LoginPortalCard';
import { adminFeatures, customerFeatures } from '../../utils/data/LoginData';

// Main PreLogin Component
const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <LoginHeader />
        <div className="max-w-4xl mx-auto">
          <LoginPortalCard
            title="Customer Portal"
            icon={
              <svg className="h-8 w-8 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
            }
            description="Access your dashboard, view access codes, download marketing materials, and review patient treatment data."
            features={customerFeatures}
            buttonText="Access Customer Portal"
            buttonLink="/customer/dashbaord"
            buttonColor="bg-orange-500"
          />
          <LoginPortalCard
            title="Admin Portal"
            icon={
              <svg className="h-8 w-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
            }
            description="Manage customer accounts, provision access codes, and generate customer invitations."
            features={adminFeatures}
            buttonText="Access Admin Portal"
            buttonLink="/admin/dashboard"
            buttonColor="bg-red-600"
          />
        </div>
        <LoginFooter />
      </div>
    </div>
  );
};

export default Login;