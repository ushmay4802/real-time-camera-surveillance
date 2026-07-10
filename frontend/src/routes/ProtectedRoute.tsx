import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    // return <Outlet />;
    const { isAuthenticated, isInitializing } = useAuth();

    // Don't redirect before we've had a chance to read localStorage,
    // otherwise a hard refresh always bounces you to /login.
    if (isInitializing) return null;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
