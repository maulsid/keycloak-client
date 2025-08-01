// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { useAuth } from './context/AuthProvider';

// import Protected from './components/Protected';
// import Public from './components/Public';
// import LoggedOut from './pages/LoggedOut';
// import Dashboard from './pages/Dashboard';

// function App() {
//   const { isAuthenticated } = useAuth();

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Public />} />
//         {/* <Route path="/dashboard" element={<Protected />} /> */}
//         <Route path="/dashboard" element={<Dashboard />} />

//         <Route path="/logged-out" element={<LoggedOut />} />
//         <Route path="*" element={<div>404: Page not found</div>} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import AppRoutes from './routes/Routes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;