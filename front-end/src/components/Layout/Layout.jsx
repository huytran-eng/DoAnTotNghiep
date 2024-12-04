import { Outlet } from 'react-router-dom'; // Outlet renders child routes
import Header from './DefaultLayout/Header';
import Sidebar from './DefaultLayout/Sidebar';

const Layout = () => {
  return (
    <div className="d-flex">
      <Sidebar className="position-sticky top-0 vh-100" />
      <div className="flex-grow-1">
        <Header />
        <div className="p-4">
          {/* The Outlet renders the content of the current route */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
