import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/formStyles.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Danh sách tài khoản cố định
  const users = [
    { username: 'HS001', password: '123456', role: 'student' },
    { username: 'GV001', password: '123456', role: 'teacher' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    // Tìm kiếm tài khoản khớp thông tin đăng nhập
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setError('');
      localStorage.setItem('user', JSON.stringify(user)); // Lưu thông tin người dùng vào localStorage
      // Điều hướng dựa trên vai trò
      if (user.role === 'student') {
        navigate('/studenthome'); // Trang StudentHome
      } else if (user.role === 'teacher') {
        navigate('/home'); // Trang Home
      }
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className='main-container'>
      <h1 className='welcome-text'>Chào mừng đến với ClassMaster!</h1>

      <div className='form-container'>
        <h2 className='form-title'>Form Đăng Nhập</h2>
        <form className='flex flex-col' onSubmit={handleLogin}>
          <div className='input-container'>
            <input
              type="text"
              placeholder="Your Username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='input-container'>
            <input
              type="password"
              placeholder="Your Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <p className='error-message'>{error}</p>}
          <button type="submit" className="submit-button">
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