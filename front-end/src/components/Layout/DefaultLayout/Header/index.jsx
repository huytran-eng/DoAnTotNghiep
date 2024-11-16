// src/components/Layout/DefaultLayout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import "../../../../styles/homeStyles.css"; // Đường dẫn từ Header đến homeStyles


const Header = () => {
  return (
    <header className="header"> {/* Áp dụng lớp CSS cho header */}
      <nav>
        <h1>Welcome to Class Master!</h1>
        <ul>
          <li><Link className="header_navbar-item" to="/">Thông báo</Link></li>
          <li><Link className="header_navbar-item" to="/monhoc">Trợ giúp</Link></li>
          <li><Link className="header_navbar-item" to="/khoahoc">GV001</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
