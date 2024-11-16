import { Link } from 'react-router-dom'; // Thêm import cho Link
import "/src/styles/resourceLinks.css"; // Chỉ sử dụng đường dẫn tuyệt đối nếu cấu hình Vite hỗ trợ




const ResourceLinks = () => {
  return (
    <div className="resource-links">
      <Link to="/class-list">Danh sách lớp học</Link>
      <Link to="/assignments">Danh sách bài tập</Link>
      <Link to="/resources">Danh sách tài liệu</Link>
    </div>
  );
};

export default ResourceLinks;
