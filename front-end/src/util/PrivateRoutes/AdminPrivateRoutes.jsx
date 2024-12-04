import { Navigate, Outlet } from "react-router-dom";
import { IsAuthenticated } from "../auth"; // Assuming IsAuthenticated checks if the user is logged in
import AdminLayout from "../../components/Admin/Layout/AdminLayout"; // Admin Layout for Admin users

const AdminPrivateRoute = () => {
  const userRole = IsAuthenticated(); // Directly get the user's role from the IsAuthenticated function

  // If the user is not authenticated or the role is not 'Admin', redirect to login or Unauthorized page
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "Admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminPrivateRoute;
