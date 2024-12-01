import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/listBaitap.css'; // CSS cho trang danh sách bài tập

import '../styles/homeStyles.css';
import '../styles/sidebarStudentStyles.css';

const ListBaitap = () => {
  const { className } = useParams(); // Lấy className từ URL
  const [assignments, setAssignments] = useState([]); // State để lưu bài tập
  const [loading, setLoading] = useState(true); // State để xử lý trạng thái tải dữ liệu

  useEffect(() => {
    // Giả sử bạn có một API hoặc dữ liệu mẫu để lấy danh sách bài tập
    const fetchAssignments = () => {
      setLoading(true);
      setTimeout(() => {
        // Dữ liệu mẫu bài tập
        const data = [
          { title: 'Bài tập 1', deadline: '2024-11-10', description: 'Miêu tả bài tập 1' },
          { title: 'Bài tập 2', deadline: '2024-11-15', description: 'Miêu tả bài tập 2' },
          { title: 'Bài tập 3', deadline: '2024-11-20', description: 'Miêu tả bài tập 3' },
        ];
        setAssignments(data); // Cập nhật danh sách bài tập
        setLoading(false); // Đánh dấu kết thúc việc tải dữ liệu
      }, 1000); // Giả lập việc tải dữ liệu mất thời gian
    };

    fetchAssignments();
  }, [className]); // Reload dữ liệu mỗi khi className thay đổi

  return (
    <div className="assignments-page">
      <h1>Danh Sách Bài Tập của Lớp {className}</h1>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Tên Bài Tập</th>
              <th>Hạn Nộp</th>
              <th>Mô Tả</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="3">Không có bài tập nào cho lớp này.</td>
              </tr>
            ) : (
              assignments.map((assignment, index) => (
                <tr key={index}>
                  <td>{assignment.title}</td>
                  <td>{assignment.deadline}</td>
                  <td>{assignment.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListBaitap;
