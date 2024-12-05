import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginVer2 from "../components/LoginVer2";
import ProblemPage from "../pages/problem-page";
import AdminPrivateRoute from "../util/PrivateRoutes/AdminPrivateRoutes";
import StudentPrivateRoute from "../util/PrivateRoutes/StudentPrivateRoutes";

// Admin components import
import AdminClassList from "../components/Admin/Class/AdminClassList";
import CreateClass from "../components/Admin/Class/CreateClass";
import AdminClassDetail from "../components/Admin/Class/AdminClassDetail";

import AdminSubjectList from "../components/Admin/Subject/AdminSubjectList";
import AdminSubjectDetail from "../components/Admin/Subject/AdminSubjectDetail";

import AdminExerciseList from "../components/Admin/Exercise/AdminExerciseList";
import AdminCreateExercise from "../components/Admin/Exercise/AdminCreateExercise";
import AdminStudentList from "../components/Admin/Student/AdminStudentList";
// Students components import
import StudentClassList from "../components/Student/Class/StudentClassList";
import StudentClassDetail from "../components/Student/Class/StudentClassDetail";
import UnauthorisedPage from "../pages/unauthorised-page";

// import AdminDetail from "../components/Admin/Class/AdminClassDetail";

const paths = [
  { path: "/login", element: <LoginVer2 /> },
  {
    path: "/",
    element: <StudentPrivateRoute />, // Protected routes for student
    children: [
      { path: "/class", element: <StudentClassList /> },
      { path: "/class/:id", element: <StudentClassDetail /> },
      { path: "class/:id/exercise/:classExerciseId", element: <ProblemPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminPrivateRoute />, // Protected routes for Admin
    children: [
      { path: "class", element: <AdminClassList /> },
      { path: "class/create", element: <CreateClass /> },
      { path: "class/:id", element: <AdminClassDetail /> },

      { path: "subject", element: <AdminSubjectList /> },
      // { path: "/subject/create", element: <CreateClass /> },
      { path: "subject/:id", element: <AdminSubjectDetail /> },

      { path: "exercise", element: <AdminExerciseList /> },
      { path: "exercise/create", element: <AdminCreateExercise /> },
      { path: "student", element: <AdminStudentList /> },
    ],
  },
  {
    path: "/code",
    element: <ProblemPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorisedPage />,
  },
];

const Routers = () => {
  const appRoutes = createBrowserRouter(paths);

  return <RouterProvider router={appRoutes} />;
};

export default Routers;
