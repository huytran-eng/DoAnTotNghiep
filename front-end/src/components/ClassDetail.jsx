import { useParams } from 'react-router-dom';
import { useState } from 'react';
import '../styles/homeStyles.css';
import '../styles/sidebarStyles.css'; // Đảm bảo đường dẫn đúng
import '../styles/classDetail.css';  // Import CSS cho Lophoc nếu có
import Sidebar from './Layout/DefaultLayout/Sidebar';

const ClassDetail = () => {
  const { className } = useParams(); // Lấy tên lớp từ URL
  const [activeTab, setActiveTab] = useState('students'); // Quản lý tab hiện tại

  // Dữ liệu chi tiết lớp học
  const classes = [
    { 
      name: 'D20CQ-CN01', 
      size: 45, 
      startDate: '18/03/2021', 
      endDate: '18/06/2021', 
      description: 'Mô tả lớp D20CQ-CN01',
      students: [
        { name: 'Nguyễn Văn A', studentId: 'SV001', dob: '01/01/2000' },
        { name: 'Trần Thị B', studentId: 'SV002', dob: '02/02/2001' },
        { name: 'Phạm Thị C', studentId: 'SV003', dob: '03/03/2002' },
      ],
      documents: [
        { title: 'Tài liệu 1', description: 'Tài liệu về môn học' },
        { title: 'Tài liệu 2', description: 'Tài liệu hướng dẫn' },
      ],
      exercises: [
        { title: 'Bài tập 1', description: 'Bài tập về toán' },
        { title: 'Bài tập 2', description: 'Bài tập về lý thuyết' },
      ]
    },
    // Các lớp học khác...
  ];

  // Tìm lớp học tương ứng với className
  const classDetail = classes.find((classItem) => classItem.name === className);

  if (!classDetail) {
    return <div>Lớp học không tồn tại.</div>;
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Hàm hiển thị bảng danh sách sinh viên
  const renderStudents = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Mã SV</th>
            <th>Ngày sinh</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {classDetail.students.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.studentId}</td>
              <td>{student.dob}</td>
              <td><button>Xem chi tiết</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Hàm hiển thị bảng danh sách tài liệu
  const renderDocuments = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Tên tài liệu</th>
            <th>Mô tả</th>
          </tr>
        </thead>
        <tbody>
          {classDetail.documents.map((document, index) => (
            <tr key={index}>
              <td>{document.title}</td>
              <td>{document.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Hàm hiển thị bảng danh sách bài tập
  const renderExercises = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Tên bài tập</th>
            <th>Mô tả</th>
          </tr>
        </thead>
        <tbody>
          {classDetail.exercises.map((exercise, index) => (
            <tr key={index}>
              <td>{exercise.title}</td>
              <td>{exercise.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>Chi tiết lớp học: {classDetail.name}</h2>
      <p><strong>Sĩ số:</strong> {classDetail.size}</p>
      <p><strong>Ngày bắt đầu:</strong> {classDetail.startDate}</p>
      <p><strong>Ngày kết thúc:</strong> {classDetail.endDate}</p>
      <p><strong>Mô tả:</strong> {classDetail.description}</p>

      {/* Các tab chuyển đổi */}
      <div>
        <button onClick={() => handleTabChange('students')} className={activeTab === 'students' ? 'active' : ''}>Danh sách sinh viên</button>
        <button onClick={() => handleTabChange('documents')} className={activeTab === 'documents' ? 'active' : ''}>Danh sách tài liệu</button>
        <button onClick={() => handleTabChange('exercises')} className={activeTab === 'exercises' ? 'active' : ''}>Danh sách bài tập</button>
      </div>

      {/* Nội dung bảng tùy thuộc vào tab được chọn */}
      {activeTab === 'students' && renderStudents()}
      {activeTab === 'documents' && renderDocuments()}
      {activeTab === 'exercises' && renderExercises()}
    </div>
  );
};

export default ClassDetail;
