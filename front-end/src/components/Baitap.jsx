import '../styles/homeStyles.css';
import '../styles/sidebarStyles.css'; // Đảm bảo đường dẫn đúng
import '../styles/baitap.css';
import Sidebar from './Layout/DefaultLayout/Sidebar';

const Baitap = () => {
  // Dữ liệu về các chương và bài tập
  const chapters = [
    {
      title: "Chương 1",
      exercises: [
        { id: 1, title: "Bài 1", description: "Mô tả bài 1" },
        { id: 2, title: "Bài 2", description: "Mô tả bài 2" },
        { id: 3, title: "Bài 3", description: "Mô tả bài 3" },
      ]
    },
    {
      title: "Chương 2",
      exercises: [
        { id: 1, title: "Bài 1", description: "Mô tả bài 1" },
        { id: 2, title: "Bài 2", description: "Mô tả bài 2" },
        { id: 3, title: "Bài 3", description: "Mô tả bài 3" },
      ]
    },
    {
      title: "Chương 3",
      exercises: [
        { id: 1, title: "Bài 1", description: "Mô tả bài 1" },
        { id: 2, title: "Bài 2", description: "Mô tả bài 2" },
        { id: 3, title: "Bài 3", description: "Mô tả bài 3" },
      ]
    },
    {
      title: "Chương 4",
      exercises: [
        { id: 1, title: "Bài 1", description: "Mô tả bài 1" },
        { id: 2, title: "Bài 2", description: "Mô tả bài 2" },
        { id: 3, title: "Bài 3", description: "Mô tả bài 3" },
      ]
    },
    {
      title: "Chương 5",
      exercises: [
        { id: 1, title: "Bài 1", description: "Mô tả bài 1" },
        { id: 2, title: "Bài 2", description: "Mô tả bài 2" },
        { id: 3, title: "Bài 3", description: "Mô tả bài 3" },
      ]
    },
    {
      title: "Chương 6",
      exercises: [
        { id: 1, title: "Bài 1", description: "Mô tả bài 1" },
        { id: 2, title: "Bài 2", description: "Mô tả bài 2" },
        { id: 3, title: "Bài 3", description: "Mô tả bài 3" },
      ]
    },
    {
      title: "Chương 1",
      exercises: [
        { id: 1, title: "Bài 1", description: "Mô tả bài 1" },
        { id: 2, title: "Bài 2", description: "Mô tả bài 2" },
        { id: 3, title: "Bài 3", description: "Mô tả bài 3" },
      ]
    },
    {
      title: "Chương 1",
      exercises: [
        { id: 1, title: "Bài 1", description: "Mô tả bài 1" },
        { id: 2, title: "Bài 2", description: "Mô tả bài 2" },
        { id: 3, title: "Bài 3", description: "Mô tả bài 3" },
      ]
    },
    {
      title: "Chương 1",
      exercises: [
        { id: 1, title: "Bài 1", description: "Mô tả bài 1" },
        { id: 2, title: "Bài 2", description: "Mô tả bài 2" },
        { id: 3, title: "Bài 3", description: "Mô tả bài 3" },
      ]
    },
    {
      title: "Chương 1",
      exercises: [
        { id: 1, title: "Bài 1", description: "Mô tả bài 1" },
        { id: 2, title: "Bài 2", description: "Mô tả bài 2" },
        { id: 3, title: "Bài 3", description: "Mô tả bài 3" },
      ]
    },
    {
      title: "Chương 1",
      exercises: [
        { id: 1, title: "Bài 1", description: "Mô tả bài 1" },
        { id: 2, title: "Bài 2", description: "Mô tả bài 2" },
        { id: 3, title: "Bài 3", description: "Mô tả bài 3" },
      ]
    },
    {
      title: "Chương 1",
      exercises: [
        { id: 1, title: "Bài 1", description: "Mô tả bài 1" },
        { id: 2, title: "Bài 2", description: "Mô tả bài 2" },
        { id: 3, title: "Bài 3", description: "Mô tả bài 3" },
      ]
    },
   
    // Thêm các chương khác nếu cần
  ];

  // Hàm xử lý khi nhấn nút "Xem Bài Tập"
  const viewExercise = (exerciseId) => {
    alert(`Đang xem bài tập ID: ${exerciseId}`);
  };

  // Hàm xử lý khi nhấn nút "Thêm Bài Tập"
  const addExercise = (chapterIndex) => {
    alert(`Thêm bài tập mới vào ${chapters[chapterIndex].title}`);
  };

  return (
    <div className='h-screen flex'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className='flex-grow flex flex-col'>
        <header className='header'>
          <nav>
            <ul className='flex space-x-4'>
              <li className='header_navbar-item'>
                <a href='/'>Welcome to Class Master!</a>
              </li>
            </ul>
            <ul className='flex space-x-4'>
              <li className='header_navbar-item'>
                <a href='/account'>Thông Báo</a>
              </li>
              <li className='header_navbar-item'>
                <a href='/help'>Trợ Giúp</a>
              </li>
              <li className='header_navbar-item'>
                <a href='/register'>GV001</a>
              </li>
            </ul>
          </nav>
        </header>

        <div className='flex-grow flex flex-col justify-center items-center bg-while'>
          <h1 className='mb-4'>Danh Sách Bài Tập</h1>

          {/* Hiển thị các chương */}
          <div className='chapters-container'>
            {chapters.map((chapter, index) => (
              <div key={index} className='chapter-container'>
                <h2>{chapter.title}</h2>

                {/* Hiển thị bài tập của mỗi chương */}
                <div className='exercises-list'>
                  {chapter.exercises.map((exercise) => (
                    <div key={exercise.id} className='exercise-item'>
                      <h3>{exercise.title}</h3>
                      <p>{exercise.description}</p>
                      <button 
                        className="view-exercise-btn"
                        onClick={() => viewExercise(exercise.id)}
                      >
                        Xem Bài Tập
                      </button>
                    </div>
                  ))}
                </div>

                {/* Nút thêm bài tập */}
                <button 
                  className='add-exercise-btn' 
                  onClick={() => addExercise(index)}
                >
                  Thêm Bài Tập
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Baitap;