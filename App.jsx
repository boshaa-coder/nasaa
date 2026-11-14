import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleLayout from './components/RoleLayout';
import AlertScreen from './components/AlertScreen';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/User/Dashboard';
import HealthCare from './pages/User/HealthCare';
import Training from './pages/User/Training';
import TestsGames from './pages/User/TestsGames';
import DrAI from './pages/User/DrAI';
import Messages from './pages/User/Messages';
import Reports from './pages/User/Reports';
import Profile from './pages/User/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import Members from './pages/admin/Members';
import SendMessages from './pages/admin/SendMessages';
import Risks from './pages/user/Risks';

export default function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <AlertScreen />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />

            {/* Any logged-in account: the layout (sidebar) depends on the role */}
            <Route element={<ProtectedRoute><RoleLayout /></ProtectedRoute>}>
              {/* Shared pages: crew members AND the leader */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/health-care" element={<HealthCare />} />
              <Route path="/training" element={<Training />} />
              <Route path="/tests" element={<TestsGames />} />
              <Route path="/dr-ai" element={<DrAI />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
 
                    <Route path="/risks" element={<Risks />} />



              {/* Crew only */}
              <Route path="/messages" element={<ProtectedRoute role="user"><Messages /></ProtectedRoute>} />

              {/* Leader only */}
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/members" element={<ProtectedRoute role="admin"><Members /></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute role="admin"><SendMessages /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  );
}