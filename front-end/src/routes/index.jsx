// src/routes.js
import Login from '../components/Login';
import Home from '../components/Home';
import Monhoc from '../components/Monhoc';
import Lophoc from '../components/Lophoc';
import Khoahoc from '../components/Khoahoc';
import Tailieu from '../components/Tailieu';
import Baitap from '../components/Baitap';
import StudentHome from '../components/StudentHome';
import LophocStudent from '../components/LophocStudent';
import ListBaitap from '../components/ListBaitap';
import ListTailieu from '../components/ListTailieu';
import ClassDetail from '../components/ClassDetail';



const publicRoutes = [
  { path: '/home', element: <Home /> },
  { path: '/studenthome', element: <StudentHome /> },
  { path: '/login', element: <Login /> },
  { path: '/', element: <Home /> },
  { path: '/monhoc', element: <Monhoc /> },
  { path: '/lophoc', element: <Lophoc /> },
  { path: '/khoahoc', element: <Khoahoc /> },
  { path: '/tailieu', element: <Tailieu /> },
  { path: '/baitap', element: <Baitap /> },
  { path: '/lophocstudent', element: <LophocStudent /> },
  { path: '/listbaitap/:className', element: <ListBaitap /> },
  
  { path: '/listtailieu/:className', element: <ListTailieu /> },
  { path: '/classdetail/:className', element: <ClassDetail /> },  


  


  
];

export { publicRoutes };
