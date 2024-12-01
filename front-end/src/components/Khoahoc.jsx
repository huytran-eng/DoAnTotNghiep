import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/homeStyles.css';
import '../styles/sidebarStyles.css'; // Đảm bảo đường dẫn đúng
import '../styles/khoahocStyles.css';  // Import CSS cho Khoahoc nếu có
import Sidebar from './Layout/DefaultLayout/Sidebar';

const Khoahoc = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // Bộ lọc khóa học

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const courses = [
    { name: 'CÔNG NGHỆ THÔNG TIN', students: 150, teachers: 3 },
    { name: 'CÔNG NGHỆ THÔNG TIN', students: 150, teachers: 3 },
    { name: 'CÔNG NGHỆ THÔNG TIN', students: 150, teachers: 3 },
    { name: 'CÔNG NGHỆ THÔNG TIN', students: 150, teachers: 3 },
    { name: 'CÔNG NGHỆ THÔNG TIN', students: 150, teachers: 3 },
    { name: 'CÔNG NGHỆ THÔNG TIN', students: 150, teachers: 3 },
    { name: 'CÔNG NGHỆ THÔNG TIN', students: 150, teachers: 3 },

    { name: 'CÔNG NGHỆ THÔNG TIN', students: 150, teachers: 3 },




    { name: 'CÔNG NGHỆ THÔNG TIN', students: 150, teachers: 3 },
    { name: 'CÔNG NGHỆ THÔNG TIN', students: 150, teachers: 3 },

    { name: 'Khóa học JavaScript', students: 200, teachers: 4 },
    { name: 'Khóa học Node.js', students: 100, teachers: 2 },
    // Thêm các khóa học khác nếu cần
  ];

  // Lọc khóa học theo từ khóa tìm kiếm và bộ lọc
  const filteredCourses = courses.filter((course) => {
    const isNameMatch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isLevelMatch = selectedFilter === 'all' || course.level === selectedFilter;

    return isNameMatch && isLevelMatch;
  });

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
                <Link to='/'>Trang chủ</Link>
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
                <Link to='/register'>Đăng ký khóa học</Link>
              </li>
            </ul>
          </nav>
        </header>

        <div className='flex-grow flex flex-col justify-center items-center bg-while'>
          <h1 className='mb-4'>Danh Sách Khóa Học</h1>

          {/* Thanh tìm kiếm và thanh lọc nằm ngang hàng */}
          <div className='search-filter-container mb-4'>
            <div className='search-container'>
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-btn">
                <i className="fa fa-search"></i>
              </button>
            </div>

            <div className="filter-container">
              <label className="filter-label">Lọc theo cấp độ:</label>
              <select value={selectedFilter} onChange={handleFilterChange} className="filter-select">
                <option value="all">Tất cả</option>
                <option value="Beginner">Dành cho người mới bắt đầu</option>
                <option value="Intermediate">Dành cho cấp trung cấp</option>
                <option value="Advanced">Dành cho cấp nâng cao</option>
              </select>
            </div>
          </div>

          {/* Nội dung bảng danh sách khóa học */}
          <div className="course-table-wrapper">
            <table className='course-table'>
              <thead>
                <tr>
                  <th>TÊN KHÓA HỌC</th>
                  <th>SỐ LƯỢNG SINH VIÊN</th>
                  
                  <th>SỐ LƯỢNG GIẢNG VIÊN</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="4">Không tìm thấy khóa học</td>
                  </tr>
                ) : (
                  filteredCourses.map((course, index) => (
                    <tr key={index}>
                      <td>{course.name}</td>
                      <td>{course.students}</td>
                      <td>{course.teachers}</td>
                      
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Khoahoc;
