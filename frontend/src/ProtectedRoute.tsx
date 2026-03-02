import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from './stores/useUserStore';
import { Spinner } from './components/ui/spinner';

export default function ProtectedRoute() {
  const { currentUser, isAuthenticating, authenticate } = useUserStore();

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  if (isAuthenticating) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-background">
        <Spinner className="size-10 w-full h-15"/>
      </div>
    );
  }

  if (!isAuthenticating && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}