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

const AdminCreateExercise = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    testCases: [{ input: "", expectedOutput: "" }],
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
      testCases: [...prevData.testCases, { input: "", expetedOutput: "" }],
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
      console.log(formData);
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(baseUrl+"exercise/create", formData, {
        headers,
      });
      alert("Exercise created successfully!");
      navigate("/baitap"); // Redirect to the exercise list or detail page
    } catch (error) {
      console.error("Error creating exercise:", error);
      alert("Failed to create exercise. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
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
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={testCase.hidden}
                onChange={(e) =>
                  handleTestCaseChange(index, "hidden", e.target.checked)
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
  );
};

export default AdminCreateExercise;
