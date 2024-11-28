import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/homeStyles.css';
import '../styles/sidebarStudentStyles.css';
import '../styles/lophocStudent.css';  // Import CSS cho Lophoc nếu có
import SidebarStudent from './Layout/DefaultLayout/SidebarStudent';

const LophocStudent = () => {
  const navigate = useNavigate();

  // Define state for search term and filter
  const [searchTerm, setSearchTerm] = useState('');  // Define searchTerm
  const [selectedFilter, setSelectedFilter] = useState('all'); // Assuming you have a filter

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term when user types
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value); // Update selected filter when user changes the selection
  };

  const handleView = (listType, className) => {
    // Chuyển trang đến ListBaitap với thông tin lớp học
    if (listType === 'assignments') {
      navigate(`/listbaitap/${className}`, { state: { className } });
    } else if (listType === 'materials') {
      navigate(`/listtailieu/${className}`, { state: { className } });
    }
  };

  // Dữ liệu lớp học mẫu
  const classes = [
    { name: 'D20CQ-CN01', size: 45, startDate: '18/03/2021', endDate: '18/06/2021' },
    { name: 'D20CQ-CN02', size: 40, startDate: '20/03/2021', endDate: '20/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN04', size: 30, startDate: '23/03/2021', endDate: '23/06/2021' },
    { name: 'D20CQ-CN05', size: 55, startDate: '25/03/2021', endDate: '25/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN04', size: 30, startDate: '23/03/2021', endDate: '23/06/2021' },
    { name: 'D20CQ-CN05', size: 55, startDate: '25/03/2021', endDate: '25/06/2021' },
    { name: 'D20CQ-CN03', size: 50, startDate: '22/03/2021', endDate: '22/06/2021' },
    { name: 'D20CQ-CN04', size: 30, startDate: '23/03/2021', endDate: '23/06/2021' },
    { name: 'D20CQ-CN05', size: 55, startDate: '25/03/2021', endDate: '25/06/2021' },
  ];

  // Filter các lớp học theo searchTerm và selectedFilter using useMemo
  const filteredClasses = useMemo(() => {
    return classes.filter(classItem => {
      const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || classItem.size >= parseInt(selectedFilter);
      return matchesSearch && matchesFilter;
    });
  }, [classes, searchTerm, selectedFilter]);

  return (
    <div className='h-screen flex'>
      {/* Sidebar */}
      <SidebarStudent />

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
                <Link to='/register'>HS001</Link>
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
          <div className="student class-table-wrapper">
            <table className="student class-table">
              <thead>
                <tr>
                  <th>TÊN LỚP</th>
                  <th>SỸ SỐ LỚP</th>
                  <th>NGÀY BẮT ĐẦU</th>
                  <th>NGÀY KẾT THÚC</th>
                  <th>DANH SÁCH BÀI TẬP</th>
                  <th>DANH SÁCH TÀI LIỆU</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan="6">Không tìm thấy lớp học</td>
                  </tr>
                ) : (
                  filteredClasses.map((classItem, index) => (
                    <tr key={index}>
                      <td>{classItem.name}</td>
                      <td>{classItem.size}</td>
                      <td>{classItem.startDate}</td>
                      <td>{classItem.endDate}</td>
                      <td>
                        {/* Nút "Xem" cho danh sách bài tập */}
                        <button onClick={() => handleView('assignments', classItem.name)}>
                          Xem Bài Tập
                        </button>
                      </td>
                      <td>
                        {/* Nút "Xem" cho danh sách tài liệu */}
                        <button onClick={() => handleView('materials', classItem.name)}>
                          Xem Tài Liệu
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

export default LophocStudent;
