import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = () => {
  const { token, user } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // İlgi alanı (interests) yoksa ve şu an onboarding'de değilse oraya yönlendir
  if (!user?.interests && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
