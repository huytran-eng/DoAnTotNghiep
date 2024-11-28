import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/listTailieu.css';
import '../styles/homeStyles.css';
import '../styles/sidebarStudentStyles.css';

import SidebarStudent from './Layout/DefaultLayout/SidebarStudent';

const ListTailieu = () => {
  const { className } = useParams(); // Get className from the URL
  const [materials, setMaterials] = useState([]); // State to hold materials
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch materials when the component mounts or when className changes
  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        // Simulating API call
        const data = [
          { title: 'Web Service và hiệu năng của Web Service', date: '2024-11-10', person: 'Đỗ Văn Hùng', download: 5, fileUrl: 'link-to-file-1' },
          { title: 'Tìm hiểu về ứng dụng JAVA', date: '2024-11-10', person: 'Nguyễn Thị Liên', download: 5, fileUrl: 'link-to-file-1' },
          { title: 'Bài giảng Lập trình WEB', date: '2024-11-10', person: 'Cao Bá Cường', download: 5, fileUrl: 'link-to-file-1' },
          { title: 'Web Service và hiệu năng của Web Service', date: '2024-11-10', person: 'Người Thêm 1', download: 5, fileUrl: 'link-to-file-1' },
          { title: 'Web Service và hiệu năng của Web Service', date: '2024-11-10', person: 'Người Thêm 1', download: 5, fileUrl: 'link-to-file-1' },
          { title: 'Web Service và hiệu năng của Web Service', date: '2024-11-10', person: 'Người Thêm 1', download: 5, fileUrl: 'link-to-file-1' },
          { title: 'Web Service và hiệu năng của Web Service', date: '2024-11-10', person: 'Người Thêm 1', download: 5, fileUrl: 'link-to-file-1' },
          { title: 'Web Service và hiệu năng của Web Service', date: '2024-11-10', person: 'Người Thêm 1', download: 5, fileUrl: 'link-to-file-1' },
          { title: 'Web Service và hiệu năng của Web Service', date: '2024-11-10', person: 'Người Thêm 1', download: 5, fileUrl: 'link-to-file-1' },
          { title: 'Web Service và hiệu năng của Web Service', date: '2024-11-10', person: 'Người Thêm 1', download: 5, fileUrl: 'link-to-file-1' },
          { title: 'Web Service và hiệu năng của Web Service', date: '2024-11-10', person: 'Người Thêm 1', download: 5, fileUrl: 'link-to-file-1' },
          
        ];
        setMaterials(data);
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [className]);

  const handleDownload = (fileUrl) => {
    // Logic to handle download
    window.location.href = fileUrl; // Or use other methods to download the file
  };

  return (
    <div className="h-screen flex student-interface">
      {/* Sidebar */}
      <SidebarStudent />

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
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

        {/* Materials Table */}
        <div className="flex-grow flex flex-col p-4">
          <h1 className="text-xl font-bold mb-4">Danh Sách Tài Liệu của Lớp {className}</h1>

          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <div className="class-table-wrapper">
              <table className="materials-table">
                <thead>
                  <tr>
                    <th>Tên Tài Liệu</th>
                    <th>Ngày Tải Lên</th>
                    <th>Người Thêm</th>
                    <th>Số Lượt Tải</th>
                    <th>Hành Động</th> {/* Cột mới cho nút tải xuống */}
                  </tr>
                </thead>
                <tbody>
                  {materials.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-materials">
                        Không có tài liệu nào cho lớp này.
                      </td>
                    </tr>
                  ) : (
                    materials.map((material, index) => (
                      <tr key={index}>
                        <td>{material.title}</td>
                        <td>{material.date}</td>
                        <td>{material.person}</td>
                        <td>{material.download}</td>
                        <td>
                          <button
                            className="download-btn"
                            onClick={() => handleDownload(material.fileUrl)}
                          >
                            Tải xuống
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListTailieu;
