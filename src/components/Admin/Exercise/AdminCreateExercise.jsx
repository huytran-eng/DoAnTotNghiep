import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  InputLabel,
  FormControl,
} from "@mui/material";
import { baseUrl } from "../../../util/constant";
import Swal from "sweetalert2";

const AdminCreateExercise = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    testCases: [{ input: "", expectedOutput: "", isHidden: false }],
  });

  const [loading, setLoading] = useState(false);
  const [difficultyLevels, setDifficultyLevels] = useState([
    { label: "Dễ", value: 1 },
    { label: "Trung bình", value: 2 },
    { label: "Khó", value: 3 },
  ]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      testCases: updatedTestCases,
    }));
  };

  const addTestCase = () => {
    setFormData((prevData) => ({
      ...prevData,
      testCases: [...prevData.testCases, { input: "", expectedOutput: "", isHidden: false }],
    }));
  };

  const removeTestCase = (index) => {
    const updatedTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      testCases: updatedTestCases,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!token) {
        throw new Error("User is not authenticated");
      }
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.post(baseUrl + "exercise/create", formData, {
        headers,
      });

      console.log(response);

      // Check if the response is successful
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Thành công",
          text: "Tạo bài tập thành công!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/admin/exercise"); // Redirect to the exercise list
        });
      } else {
        // Handle other non-success statuses
        Swal.fire({
          title: "Có lỗi xảy ra!",
          text: ".",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error creating exercise:", error);

      // Handle API error response and display appropriate message
      const errorMessage =
        error.response?.data?.message || // Custom message returned from API
        "Đã có lỗi xảy ra khi tạo bài tập.";

      const statusCode = error.response?.status;

      // Show SweetAlert popup with error message based on status code
      if (statusCode === 400) {
        Swal.fire({
          title: "Bad Request",
          text: errorMessage,
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else if (statusCode === 401) {
        Swal.fire({
          title: "Unauthorized",
          text: "You are not authorized. Please log in again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Lỗi hệ thống",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {/* Loading Spinner */}
      {loading && (
        <Box
          sx={{
            position: "fixed", // Fixed to the viewport
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999, // Ensure it appears on top of other elements
            pointerEvents: "none", // Prevent interaction with any other elements behind the spinner
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "80%",
          margin: "auto",
          mt: 4,
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" textAlign="center">
          Tạo bài tập
        </Typography>

        <TextField
          label="Tiêu đề"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          label="Đề bài"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={6}
          required
        />
        <TextField
          label="Yêu cầu"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          fullWidth
          required
        />
        <FormControl fullWidth>
          <InputLabel id="difficulty-label">Độ khó</InputLabel>
          <Select
            labelId="difficulty-label"
            id="difficulty"
            label="Độ khó"
            onChange={handleChange}
            name="difficulty"
          >
            {difficultyLevels.map((level) => (
              <MenuItem key={level.value} value={level.value}>
                {level.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Giới hạn thời gian (giây)"
          name="timeLimit"
          value={formData.timeLimit}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          label="Giới hạn không gian (kB)"
          name="spaceLimit"
          value={formData.spaceLimit}
          onChange={handleChange}
          fullWidth
          required
        />

        <Typography variant="h6">Test case</Typography>

        {formData.testCases.map((testCase, index) => (
          <Box key={index} sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Đầu vào"
              name={`input-${index}`}
              value={testCase.input}
              onChange={(e) =>
                handleTestCaseChange(index, "input", e.target.value)
              }
              fullWidth
              multiline
              rows={4}
              required
            />
            <TextField
              label="Đầu ra"
              name={`expectedOutput-${index}`}
              value={testCase.output}
              onChange={(e) =>
                handleTestCaseChange(index, "expectedOutput", e.target.value)
              }
              fullWidth
              multiline
              rows={4}
              required
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={testCase.isHidden}
                  onChange={(e) =>
                    handleTestCaseChange(index, "isHidden", e.target.checked)
                  }
                />
              }
              label="Ẩn"
              sx={{ alignSelf: "center" }}
            />

            <Button
              variant="outlined"
              color="error"
              onClick={() => removeTestCase(index)}
              sx={{ alignSelf: "flex-end" }}
            >
              Hủy
            </Button>
          </Box>
        ))}

        <Button variant="outlined" onClick={addTestCase} sx={{ mb: 2 }}>
          Thêm test case
        </Button>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          {loading ? "Creating..." : "Create Exercise"}
        </Button>
      </Box>
    </Box>
  );
};

export default AdminCreateExercise;
