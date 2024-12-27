import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginVer2 from "../components/LoginVer2";
import ProblemPage from "../pages/problem-page";
import AdminPrivateRoute from "../util/PrivateRoutes/AdminPrivateRoutes";
import StudentPrivateRoute from "../util/PrivateRoutes/StudentPrivateRoutes";
import TeacherPrivateRoute from "../util/PrivateRoutes/TeacherPrivateRoutes";


// Admin components import
import AdminClassList from "../components/Admin/Class/AdminClassList";
import CreateClass from "../components/Admin/Class/CreateClass";
import AdminClassDetail from "../components/Admin/Class/AdminClassDetail";

import AdminSubjectList from "../components/Admin/Subject/AdminSubjectList";
import AdminSubjectDetail from "../components/Admin/Subject/AdminSubjectDetail";
import AdminSubjectCreate from "../components/Admin/Subject/AdminSubjectCreate";
import AdminEditSubject from "../components/Admin/Subject/AdminEditSubject";


import AdminExerciseList from "../components/Admin/Exercise/AdminExerciseList";
import AdminCreateExercise from "../components/Admin/Exercise/AdminCreateExercise";
import AdminEditExercise from "../components/Admin/Exercise/AdminEditExercise";
import AdminExerciseDetail from "../components/Admin/Exercise/AdminExerciseDetail";

import AdminStudentList from "../components/Admin/Student/AdminStudentList";
import AdminStudentDetail from "../components/Admin/Student/AdminStudentDetail";
// Students components import
import StudentClassList from "../components/Student/Class/StudentClassList";
import StudentClassDetail from "../components/Student/Class/StudentClassDetail";
import StudentDetailForClass from "../components/Student/Class/StudentDetailForClass";

// Teacher components import
import TeacherClassList from "../components/Teacher/Class/TeacherClassList";
import TeacherClassDetail from "../components/Teacher/Class/TeacherClassDetail";

import TeacherSubjectList from "../components/Teacher/Subject/TeacherSubjectList";
import TeacherSubjectDetail from "../components/Teacher/Subject/TeacherSubjectDetail";

import TeacherExerciseList from "../components/Teacher/Exercise/TeacherExerciseList";
import TeacherExerciseDetail from "../components/Teacher/Exercise/TeacherExerciseDetail";

import TeacherStudentList from "../components/Teacher/Student/TeacherStudentList";
import TeacherStudentDetail from "../components/Teacher/Student/TeacherStudentDetail";
import UnauthorisedPage from "../pages/unauthorised-page";
import TeacherStudentDetailForClass from "../components/Teacher/Class/TeacherStudentDetailForClass";


const paths = [
  { path: "/login", element: <LoginVer2 /> },
  {
    path: "/",
    element: <StudentPrivateRoute />, // Protected routes for student
    children: [
      { path: "class", element: <StudentClassList /> },
      { path: "class/:id", element: <StudentClassDetail /> },
      { path: "class/:id/exercise/:classExerciseId", element: <ProblemPage /> },
      { path: "class/:id/student/:studentId", element: <StudentDetailForClass /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminPrivateRoute />,
    children: [
      { path: "class", element: <AdminClassList /> },
      { path: "class/create", element: <CreateClass /> },
      { path: "class/:id", element: <AdminClassDetail /> },

      { path: "subject", element: <AdminSubjectList />, },
      { path: "subject/create", element: <AdminSubjectCreate /> },
      { path: "subject/:id", element: <AdminSubjectDetail /> },
      { path: "subject/edit/:id", element: <AdminEditSubject /> },

      { path: "exercise", element: <AdminExerciseList /> },
      { path: "exercise/edit/:id", element: <AdminEditExercise /> },
      { path: "exercise/create", element: <AdminCreateExercise /> },
      { path: "exercise/:id", element: <AdminExerciseDetail /> },

     
      { path: "student", element: <AdminStudentList /> },
      { path: "student/:id", element: <AdminStudentDetail /> },
    ],
  },
  {
    path: "/teacher",
    element: <TeacherPrivateRoute />, // Protected routes for Teacher
    children: [
      { path: "class", element: <TeacherClassList /> },
      { path: "class/:id", element: <TeacherClassDetail /> },
      { path: "class/:id/student/:studentId", element: <TeacherStudentDetailForClass /> },


      { path: "subject", element: <TeacherSubjectList />, },
      { path: "subject/:id", element: <TeacherSubjectDetail /> },

      { path: "exercise", element: <TeacherExerciseList /> },
      { path: "exercise/:id", element: <TeacherExerciseDetail /> },

      { path: "student", element: <TeacherStudentList /> },
      { path: "student/:id", element: <TeacherStudentDetail /> },
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
