import { useState } from 'react';  
import { Link } from 'react-router-dom';
import '/src/styles/contentStyles.css';

const Content = () => {
  const [showLinks, setShowLinks] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const subjects = [
    "LẬP TRÌNH PYTHON",
    "LẬP TRÌNH WEB",
    "XỬ LÝ ẢNH",
    "HỆ ĐIỀU HÀNH",
    "LẬP TRÌNH HƯỚNG DỊCH VỤ",
    "XÂY DỰNG HỆ THỐNG NHÚNG",
    "LẬP TRÌNH MOBILE",
    "QUẢN LÝ DỰ ÁN PHẦN MỀM",
    "LẬP TRÌNH JAVA",
    "IOT VÀ ỨNG DỤNG",
    "PHÁT TRIỂN HỆ THỐNG THÔNG MINH",
    "XỬ LÝ TÍN HIỆU SỐ",
    "LẬP TRÌNH C++",
    "GIẢI TÍCH 2",
    "LẬP TRÌNH C#",
  ];

  const toggleLinks = (subject) => {
    setShowLinks((prevState) => ({
      ...prevState,
      [subject]: !prevState[subject],
    }));
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='content-container'>
      <div className="header-row">
        <h2 className="header-title">DANH SÁCH MÔN HỌC</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search search-icon"></i>
        </div>
      </div>

      {/* Thêm div bọc ngoài bảng để tạo cuộn */}
      <div className="table-scroll-container">
        <table className='table'>
          <thead>
            <tr>
              <th>Khoa</th>
              <th>Tên Môn</th>
              <th>Số Lượng Lớp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject, index) => (
              <tr key={index}>
                <td>Khoa CNTT</td>
                <td>{subject}</td>
                <td>5</td>
                <td>
                  <button onClick={() => toggleLinks(subject)}>Xem</button>
                  {showLinks[subject] && (
                    <div className="resource-links">
                      <Link to="/lophoc">Danh sách lớp học</Link>
                      <Link to="/tailieu">Danh sách tài liệu</Link>
                      <Link to="/baitap">Danh sách bài tập</Link>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Content;
