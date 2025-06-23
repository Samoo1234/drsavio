import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: ReactNode;
  session: Session | null;
}

const ProtectedRoute = ({ children, session }: ProtectedRouteProps) => {
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;