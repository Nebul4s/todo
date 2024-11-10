import { Navigate, Outlet } from "react-router-dom";
import useUser from "../context/useUser";

const ProtectedRoute = () => {
  const { user } = useUser();
  if (!user || !user.token) return <Navigate to="/signin" />;
  return <Outlet />;
};

export default ProtectedRoute;
