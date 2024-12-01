import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet renders child routes
import Header from './DefaultLayout/Header';
import Sidebar from './DefaultLayout/Sidebar';

const Layout = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div>
        {/* The Outlet renders the content of the current route */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
