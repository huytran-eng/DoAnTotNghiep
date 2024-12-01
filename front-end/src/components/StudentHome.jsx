import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/homeStyles.css';
import '../styles/sidebarStudentStyles.css'; 
import SidebarStudent from './Layout/DefaultLayout/SidebarStudent';

const StudentHome = () => {
  const [user, setUser] = useState(null); // State để lưu thông tin người dùng
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log("Stored user:", storedUser);
    if (!storedUser || storedUser.role !== 'student') {
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  return (
    <div className='h-screen flex'>
      {/* Sidebar */}
      <SidebarStudent/>

      {/* Main Content */}
      <div className='flex-grow flex flex-col'>
        <header className='header'>
          <nav>
            <ul className='flex space-x-4'>
              <li className='header_navbar-item'>
                <Link to='/'>Welcome to Class Master!</Link>
              </li>
            </ul>
            <ul className='flex space-x-4'>
              <li className='header_navbar-item'>
                <Link to='/account'>Thông Báo</Link>
              </li>
              <li className='header_navbar-item'>
                <Link to='/help'>Trợ Giúp</Link>
              </li>
              <li className='header_navbar-item'>
                <Link to='/register'>HS001</Link>
              </li>
            </ul>
          </nav>
        </header>

        <div className='flex-grow flex flex-col justify-center items-center bg-while'>
          <h1 className='mb-4'>Chào mừng đến với Home!</h1>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
