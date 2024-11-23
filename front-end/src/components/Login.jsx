import { Link, useNavigate } from 'react-router-dom';
import '../styles/formStyles.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    navigate('/home'); // Chuyển hướng đến trang Home
  };

  return (
    <div className='main-container'> {/* Sử dụng lớp CSS từ formStyles.css */}
      <h1 className='welcome-text'>Chào mừng đến với ClassMaster!</h1>

      <div className='form-container'>
        <h2 className='form-title'>Form Đăng Nhập</h2>
        <form className='flex flex-col' onSubmit={handleLogin}>
          <div className='input-container'>
            <input
              type="text"
              placeholder="Your Email"
              className="input-field" // Sử dụng lớp CSS từ formStyles.css
            />
          </div>
          <div className='input-container'>
            <input
              type="password"
              placeholder="Your Password"
              className="input-field" // Sử dụng lớp CSS từ formStyles.css
            />
          </div>
          <button
            type="submit"
            className="submit-button" // Sử dụng lớp CSS từ formStyles.css
          >
            Login
          </button>
        </form>
        <div className='register-link'>
          <span>New Here? <Link to='/register' className="link">Create an Account</Link></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
