import { Navigate, Outlet } from "react-router-dom";
import { IsAuthenticated } from "./auth"; // Assuming you have a custom context for authentication

const PrivateRoute = () => {
  const userRole = IsAuthenticated(); // Get user data from context (this can include the role)
  // If the user is not authenticated, redirect to login or unauthorized page
  if (!userRole) {
    return <Navigate to="/unauthorized" />;
  }

  // If the user is authenticated, check their role
  if (userRole === "Admin") {
    return <Navigate to="/admin" />;
  } else if (userRole === "Student") {
    return <Navigate to="/student" />;
  }

  // Default behavior: if the role is not recognized, show unauthorized page
  return <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
