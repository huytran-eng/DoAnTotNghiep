// src/components/UnauthorizedComponent.jsx
import { useNavigate } from "react-router-dom";

const UnauthorizedComponent = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleGoHome = () => {
    navigate("/home"); // Navigate to the home page
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>403 - Unauthorized</h1>
      <p style={styles.message}>
        You do not have permission to access this page.
      </p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleGoBack}>
          Go Back
        </button>
        <button style={styles.button} onClick={handleGoHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#dc3545",
  },
  message: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    color: "#6c757d",
  },
  buttonContainer: {
    display: "flex",
    gap: "1rem",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default UnauthorizedComponent;
