import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-olive animate-pulse">Chargement...</p>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  return children;
};

export default RequireAuth;
