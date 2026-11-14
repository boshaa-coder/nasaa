import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminLayout';
import UserLayout from './UserLayout';
import AppBackground from './AppBackground';

// One shell for every logged-in route: the sidebar depends on the role,
// and the background video stays mounted while you move between pages.
export default function RoleLayout() {
  const { user } = useAuth();
  return (
    <>
      <AppBackground />
      {user.role === 'admin' ? <AdminLayout /> : <UserLayout />}
    </>
  );
}