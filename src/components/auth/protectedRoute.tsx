import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useCheckSession } from "../../api/queries/useAuth";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { refetch: checkSession } = useCheckSession();
  useEffect(() => {
    if (token) {
      checkSession();
    }
  }, [location.pathname, checkSession, token]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
