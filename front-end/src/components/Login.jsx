import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/formStyles.css"; // Ensure this file contains styles for the form

const Login = () => {
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Reset error message before new attempt

    try {
      const response = await fetch("https://localhost:7104/api/User/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data));

        navigate(""); // Redirect to dashboard
      } else {
        setError("Invalid username or password"); // Show error on failure
      }
    } catch (err) {
      setError("Login failed. Please try again later.", err); // Show general error
    }
  };

  return (
    <div className="main-container">
      <h1 className="welcome-text">Welcome to ClassMaster!</h1>

      <div className="form-container">
        <h2 className="form-title">Login Form</h2>

        <form className="flex flex-col" onSubmit={handleLogin}>
          {/* Username Input */}
          <div className="input-container">
            <input
              type="text"
              placeholder="Username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username
              required
            />
          </div>

          {/* Password Input */}
          <div className="input-container">
            <input
              type="password"
              placeholder="Your Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Login
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="error-text">{error}</p>}

        {/* Register Link */}
        <div className="register-link">
          <span>
            New Here?{" "}
            <Link to="/register" className="link">
              Create an Account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
