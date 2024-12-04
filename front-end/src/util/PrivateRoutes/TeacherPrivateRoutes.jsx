import { Navigate, Outlet } from "react-router-dom";
import { IsAuthenticated } from "./auth"; // Assuming IsAuthenticated checks if the user is logged in
import { useState, useEffect } from "react";
import TeacherLayout from "../components/Layout/TeacherLayout"; // Assuming you have a Teacher layout

const TeacherPrivateRoute = () => {
  const isAuthenticated = IsAuthenticated();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUserRole(userInfo?.position); // Assuming position is the role (e.g., Admin, Teacher, Student)
  }, []);

  // If the user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user is not a Teacher, redirect to Unauthorized page
  if (userRole !== "Teacher") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <TeacherLayout>
      <Outlet />
    </TeacherLayout>
  );
};

export default TeacherPrivateRoute;
