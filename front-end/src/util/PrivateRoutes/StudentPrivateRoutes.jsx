import { Navigate, Outlet } from "react-router-dom";
import { IsAuthenticated } from "../auth"; // Assuming IsAuthenticated checks if the user is logged in
import StudentLayout from "../../components/Student/Layout/StudentLayout"; // Admin Layout for Admin users

const StudentPrivateRoute = () => {
  const userRole = IsAuthenticated(); // Directly get the user's role from the IsAuthenticated function
  // If the user is not authenticated or the role is not 'Admin', redirect to login or Unauthorized page
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  if (userRole == "Admin") {
    return <Navigate to="/admin" replace />;
  }
  if (userRole !== "Student") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <StudentLayout>
      <Outlet />
    </StudentLayout>
  );
};

export default StudentPrivateRoute;
