// src/Monhoc.jsx
import Header from "./Layout/DefaultLayout/Header";
import Sidebar from "./Layout/DefaultLayout/Sidebar";
import Content from "./Layout/DefaultLayout/Content"; // Chắc chắn rằng Content là phần nội dung chính của bạn

import "../styles/monhocStyles.css"; // Thêm style cho Monhoc

const Monhoc = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar bên trái */}
      <Sidebar />

      {/* Nội dung chính */}
      <div style={{ flexGrow: 1 }}>
        {/* Header */}
        <Header />
        
        {/* Phần nội dung chính của Monhoc */}
        <Content />
      </div>
    </div>
  );
};

export default Monhoc;
