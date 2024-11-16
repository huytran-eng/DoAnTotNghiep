import { Link } from 'react-router-dom';
import '../styles/homeStyles.css';
import '../styles/sidebarStyles.css'; // Đảm bảo đường dẫn đúng
import '../styles/tailieu.css';
import { useState } from 'react';

const Lophoc = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // Bộ lọc sĩ số

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const classes = [
    { name: 'Học về WebService', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '235' },
    { name: 'Ứng dụng IOT trong đời sống', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '232' },
    { name: 'Bài giảng lập trình Python', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '98' },
    { name: 'Bài giảng lập trình Python', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '98' },
    { name: 'Bài giảng lập trình Python', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '98' },
    { name: 'Bài giảng lập trình Python', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '98' },
    { name: 'Bài giảng lập trình Python', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '98' },
    { name: 'Bài giảng lập trình Python', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '98' },
    { name: 'Bài giảng lập trình Python', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '98' },
    { name: 'Bài giảng lập trình Python', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '98' },
    { name: 'Bài giảng lập trình Python', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '98' },
    { name: 'Bài giảng lập trình Python', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '98' },
    { name: 'Bài giảng lập trình Python', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '98' },
    { name: 'Bài giảng lập trình Python', date: '18/03/2021', person: 'Nguyễn Văn Hưng', amount: '98' },
    // Thêm các lớp học khác nếu cần
  ];

  // Lọc lớp học theo từ khóa tìm kiếm và bộ lọc sĩ số
  const filteredClasses = classes.filter((classItem) => {
    const isNameMatch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isSizeMatch = selectedFilter === 'all' || classItem.amount >= parseInt(selectedFilter);

    return isNameMatch && isSizeMatch;
  });

  return (
    <div className='h-screen flex'>
      {/* Sidebar */}
      <aside className='sidebar'>
        <ul className='sidebar-list'>
          <li className='sidebar-item'>
            <Link to="/monhoc">Môn Học</Link>
          </li>
          <li className='sidebar-item'>
            <Link to="/khoahoc">Khoa Học</Link>
          </li>
          <li className='sidebar-item'>
            <Link to="/lophoc">Lớp Học</Link>
          </li>
        </ul>
      </aside>

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

        <div className='flex-grow flex flex-col justify-center items-center bg-blue-200'>
          <h1 className='mb-4'>Danh Sách Tài Liệu</h1>

          {/* Thanh tìm kiếm và thanh lọc nằm ngang hàng */}
          <div className='search-filter-container mb-4'>
            <div className='search-container'>
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-btn">
                <i className="fa fa-search"></i>
              </button>
            </div>
          </div>

          {/* Nội dung bảng danh sách lớp học */}
          <div className="class-table-wrapper">
            <table className='class-table'>
              <thead>
                <tr>
                  <th>TÊN TÀI LIỆU</th>
                  <th>NGÀY THÊM</th>
                  <th>NGƯỜI THÊM</th>
                  <th>SỐ LƯỢT TẢI</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan="5">Không tìm thấy lớp học</td>
                  </tr>
                ) : (
                  filteredClasses.map((classItem, index) => (
                    <tr key={index}>
                      <td>{classItem.name}</td>
                      <td>{classItem.date}</td>
                      <td>{classItem.person}</td>
                      <td>{classItem.amount}</td>
                      <td>
                        {/* Action Buttons */}
                        <button className="action-btn download-btn">
                          Download
                        </button>
                        <button className="action-btn edit-btn">
                          Edit
                        </button>
                      </td>
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

export default Lophoc;
