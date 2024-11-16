// src/routes.js
import Login from '../components/Login';
import Home from '../components/Home';
import Monhoc from '../components/Monhoc';
import Lophoc from '../components/Lophoc';
import Khoahoc from '../components/Khoahoc';
import Tailieu from '../components/Tailieu';
import Baitap from '../components/Baitap';

const publicRoutes = [
  { path: '/home', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/', element: <Home /> },
  { path: '/monhoc', element: <Monhoc /> },
  { path: '/lophoc', element: <Lophoc /> },
  { path: '/khoahoc', element: <Khoahoc /> },
  { path: '/tailieu', element: <Tailieu /> },
  { path: '/baitap', element: <Baitap /> },
  
];

export { publicRoutes };
