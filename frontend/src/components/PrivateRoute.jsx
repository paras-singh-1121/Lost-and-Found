import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function PrivateRoute({ children }) {

  const { authUser, isCheckingAuth } = useAuthStore();


  // show loader while checking
  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }


  // not logged in
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }


  // logged in
  return children;
}