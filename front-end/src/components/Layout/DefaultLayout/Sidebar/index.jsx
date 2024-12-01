// src/components/Sidebar.jsx
// import { Link } from 'react-router-dom';
// import "../../../../styles/sidebarStyles.css";

// const Sidebar = ( onShowContent ) => {
//     return (
//       <div className="sidebar">

//         <ul className="sidebar-list">
//           <li className="sidebar-item">
//             <Link to="/monhoc" onClick={onShowContent}>Môn Học</Link>
//           </li>
//           <li className="sidebar-item">
//             <Link to="/khoahoc" onClick={onShowContent}>Khoa Học</Link>
//           </li>
//           <li className="sidebar-item">
//             <Link to="/lophoc" onClick={onShowContent}>Lớp Học</Link>
//           </li>
//         </ul>
//       </div>
//     );
// };
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
  BookmarkIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/solid";
import logoPtit from "../../../../assets/image/logo/Logo_PTIT.jpg";
import { useNavigate } from "react-router-dom";
export function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear JWT token
    localStorage.removeItem("userInfo"); // Clear user information
    navigate("/login"); // Redirect to login page
  };

  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4 flex justify-center items-center">
        <img src={logoPtit} alt="logo" className="w-20 h-20" />
      </div>
      <List>
        <ListItem onClick={() => navigate("/subject")}>
          <ListItemPrefix>
            <PresentationChartBarIcon className="h-5 w-5" />
          </ListItemPrefix>
          <Typography color="blue-gray" className="mr-auto font-normal">
            Môn học
          </Typography>
        </ListItem>
        <ListItem onClick={() => navigate("/khoahoc")}>
          <ListItemPrefix>
            <BookmarkIcon className="h-5 w-5" />
          </ListItemPrefix>
          <Typography color="blue-gray" className="mr-auto font-normal">
            Khoa học
          </Typography>
        </ListItem>
        <ListItem onClick={() => navigate("/class")}>
          <ListItemPrefix>
            <CodeBracketIcon className="h-5 w-5" />
          </ListItemPrefix>
          <Typography color="blue-gray" className="mr-auto font-normal">
            Lớp học
          </Typography>
        </ListItem>
        {user.position === "Admin" && (
          <ListItem onClick={() => navigate("/baitap")}>
            <ListItemPrefix>
              <CodeBracketIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Bài tập
            </Typography>
          </ListItem>
        )}
        {user.position === "Admin" && (
          <ListItem onClick={() => navigate("/student")}>
            <ListItemPrefix>
              <CodeBracketIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Sinh viên
            </Typography>
          </ListItem>
        )}
        <hr className="my-2 border-blue-gray-50" />
        <ListItem>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>
        <ListItem onClick={handleLogout}>
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
  );
}

export default Sidebar;
