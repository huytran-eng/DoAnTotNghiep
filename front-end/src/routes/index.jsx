// src/routes.js
import Home from '../components/Home';
import Monhoc from '../components/Monhoc';
import Lophoc from '../components/Lophoc';
import Khoahoc from '../components/Khoahoc';
import Tailieu from '../components/Tailieu';
import Baitap from '../components/Baitap';
import SubjectDetail from '../components/ChiTietMonHoc';
import CreateClass from '../components/TaoLopHoc';
import CreateExercise from '../components/TaoBaiTap'
import PrivateRoute from '../util/privateRoute';
import ExerciseDetail from '../components/ExerciseDetail';
import Students from '../components/Students'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginVer2 from '../components/LoginVer2';
import ProblemPage from '../pages/problem-page';



const paths = [
  { path: "/login", element: <LoginVer2 /> },
  {path: "/", element: <PrivateRoute />, children: [
    { path: "/home", element: <Home />  },
    { path: "/", element: <Home />  },
    { path: "/subject", element: <Monhoc />  },
    { path: "/class", element: <Lophoc />  },
    { path: "/khoahoc", element: <Khoahoc />  },
    { path: "/tailieu", element: <Tailieu />  },
    { path: "/baitap", element: <Baitap />  },
    { path: "/subject/:id", element: <SubjectDetail />  },
    { path: "/class/create", element: <CreateClass />  },
    { path: "/exercise/create", element: <CreateExercise />  },
    {path: "/exercise/:id", element: <ExerciseDetail/>},
    { path: "/student", element: <Students />  },
  ]},
  {path: "/code", element: <ProblemPage/>}

]


const Routers = () => {
  const appRoutes = createBrowserRouter(paths);

  return <RouterProvider router={appRoutes} />
}

export default Routers;