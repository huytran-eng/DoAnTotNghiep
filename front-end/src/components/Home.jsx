import { Link } from 'react-router-dom';
import '../styles/homeStyles.css';
import '../styles/sidebarStyles.css'; 
import Sidebar from './Layout/DefaultLayout/Sidebar';

const Home = () => {
  return (
    <div className='h-screen flex'>
      {/* Sidebar */}
      <Sidebar/>

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
                <Link to='/register'>GV001</Link>
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

export default Home;
