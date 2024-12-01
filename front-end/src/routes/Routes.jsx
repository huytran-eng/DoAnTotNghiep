// // src/routes/Routes.js
// import { Routes, Route } from "react-router-dom";
// import Home from "../components/Home";
// import Login from "../components/Login";
// import PrivateRoute from "../util/privateRoute";
// import { Navigate } from "react-router-dom";
// import Monhoc from "../components/Monhoc";
// import Lophoc from "../components/Lophoc";
// import Khoahoc from "../components/Khoahoc";
// import Tailieu from "../components/Tailieu";
// import Baitap from "../components/Baitap";
// import SubjectDetail from "../components/ChiTietMonHoc";
// import CreateClass from "../components/TaoLopHoc";

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />

//       <Route element={<PrivateRoute />}>
//         <Route path="/" element={<Home />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/subject" element={<Monhoc />} />
//         <Route path="/class" element={<Lophoc />} />
//         <Route path="/khoahoc" element={<Khoahoc />} />
//         <Route path="/tailieu" element={<Tailieu />} />
//         <Route path="/baitap" element={<Baitap />} />
//         <Route path="/subject/:id" element={<SubjectDetail />} />
//         <Route path="/class/create" element={<CreateClass />} />
//       </Route>

//       <Route path="*" element={<Navigate to="/login" />} />
//     </Routes>
//   );
// };

// export default AppRoutes;
