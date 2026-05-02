import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NAV_LINKS } from '../routes/paths';

export const ProtectedRoute = ({
  allowedRoles
}: {
  allowedRoles?: ('student' | 'teacher' | 'admin')[];
}) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={NAV_LINKS.LOGIN} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect based on role if they try to access forbidden page
    if (role === 'teacher') return <Navigate to={NAV_LINKS.TEACHER_DASHBOARD} replace />;
    if (role === 'student') return <Navigate to={NAV_LINKS.STUDENT_DASHBOARD} replace />;
    return <Navigate to={NAV_LINKS.HOME} replace />;
  }

  return <Outlet />;
};
