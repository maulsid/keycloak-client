import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';

import Protected from './components/Protected';
import Public from './components/Public';
import LoggedOut from './pages/LoggedOut';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/dashboard" element={<Protected />} />
        <Route path="/logged-out" element={<LoggedOut />} />
        <Route path="*" element={<div>404: Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;