import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { IsAuthenticated } from './auth';
import Header from '../components/Layout/DefaultLayout/Header';
import Sidebar from '../components/Layout/DefaultLayout/Sidebar';
const PrivateRoute = () => {
    const isAuthenticated = IsAuthenticated();
  
    return isAuthenticated ? (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flexGrow: 1 }}>
          <Header />
        <Outlet />
        </div>
      </div>
    ) : (
      <Navigate to="/login" replace />
    );
  };
  
  export default PrivateRoute;
