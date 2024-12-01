import { Link } from "react-router-dom";
import "../styles/homeStyles.css";
import "../styles/sidebarStyles.css";
import Sidebar from "./Layout/DefaultLayout/Sidebar";

const Home = () => {
  return (
    <div className="flex-grow flex flex-col justify-center items-center bg-blue-200">
      <h1 className="mb-4">Chào mừng đến với Home!</h1>
    </div>
  );
};

export default Home;
