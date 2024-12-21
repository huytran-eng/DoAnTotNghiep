import { Navigate, Outlet, useLocation } from "react-router-dom";
import { IsAuthenticated } from "../auth"; // Assuming IsAuthenticated checks if the user is logged in
import TeacherLayout from "../../components/Teacher/Layout/TeacherLayout"; 


const TeacherPrivateRoute = () => {
  const userRole = IsAuthenticated(); // Directly get the user's role from the IsAuthenticated function
  // If the user is not authenticated or the role is not 'Admin', redirect to login or Unauthorized page
  const local = useLocation();
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }  
  console.log(userRole)
  if (userRole !== "Teacher") {
    return <Navigate to="/unauthorized" replace />;
  } // Redirect to the default route for Admin
  if(local.pathname === "/teacher") {
    return <Navigate to="/teacher/class" replace />;
  }
  return (
    <TeacherLayout>
      <Outlet />
    </TeacherLayout>
  );
};
export default TeacherPrivateRoute;

