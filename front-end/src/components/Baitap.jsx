import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/homeStyles.css';
import '../styles/sidebarStyles.css'; // Đảm bảo đường dẫn đúng
import '../styles/baitap.css';
import Sidebar from './Layout/DefaultLayout/Sidebar';

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
    { name: 'D20CQ-CN01', size: 45, startDate: '18/03/2021', endDate: '18/06/2021' },
    { name: 'D20CQ-CN02', size: 40, startDate: '20/03/2021', endDate: '20/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    // Thêm các lớp học khác nếu cần
  ];

  // Lọc lớp học theo từ khóa tìm kiếm và bộ lọc sĩ số
  const filteredClasses = classes.filter((classItem) => {
    const isNameMatch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isSizeMatch = selectedFilter === 'all' || classItem.size >= parseInt(selectedFilter);

    return isNameMatch && isSizeMatch;
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
          <h1 className='mb-4'>Danh Sách Lớp Học</h1>

          {/* Thanh tìm kiếm và thanh lọc nằm ngang hàng */}
          <div className='search-filter-container mb-4'>
            <div className='search-container'>
              <input
                type="text"
                placeholder="Tìm kiếm lớp học..."
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-btn">
                <i className="fa fa-search"></i>
              </button>
            </div>

            <div className="filter-container">
              <label className="filter-label">Lọc theo sĩ số lớp:</label>
              <select value={selectedFilter} onChange={handleFilterChange} className="filter-select">
                <option value="all">Tất cả</option>
                <option value="40">Lớp từ 40 người trở lên</option>
                <option value="50">Lớp từ 50 người trở lên</option>
              </select>
            </div>
          </div>

          {/* Nội dung bảng danh sách lớp học */}
          <div className="class-table-wrapper">
            <table className='class-table'>
              <thead>
                <tr>
                  <th>TÊN LỚP</th>
                  <th>SỸ SỐ LỚP</th>
                  <th>NGÀY BẮT ĐẦU</th>
                  <th>NGÀY KẾT THÚC</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan="4">Không tìm thấy lớp học</td>
                  </tr>
                ) : (
                  filteredClasses.map((classItem, index) => (
                    <tr key={index}>
                      <td>{classItem.name}</td>
                      <td>{classItem.size}</td>
                      <td>{classItem.startDate}</td>
                      <td>{classItem.endDate}</td>
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
