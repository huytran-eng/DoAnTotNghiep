import { Navigate, Outlet } from "react-router-dom";
import { IsAuthenticated } from "./auth";

import AdminLayout from "../components/Admin/Layout/AdminLayout"; // Import Admin layout
// import TeacherLayout from "../components/Layout/TeacherLayout"; // Import Teacher layout
// import StudentLayout from "../components/Layout/StudentLayout"; // Import Student layout

const PrivateRoute = () => {
  const isAuthenticated = IsAuthenticated();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")); // Assuming user info is stored in localStorage

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = userInfo?.position; // Assuming 'position' is the role field in user info

  let Layout;
  switch (userRole) {
    case "Admin":
      Layout = AdminLayout;
      break;
    // case "Teacher":
    //   Layout = TeacherLayout;
    //   break;
    // case "Student":
    //   Layout = StudentLayout;
    //   break;
    // default:
    //   Layout = null; // Fallback if no role found
    //   break;
  }

  return Layout ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/unauthorized" replace /> // Redirect to Unauthorized if no layout is assigned
  );
};

export default PrivateRoute;
