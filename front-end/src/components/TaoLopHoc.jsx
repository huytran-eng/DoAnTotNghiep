import React, { useState, useEffect } from "react";
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
} from "@mui/material";

const CreateClass = () => {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    teacherId: "",
    subjectId: "",
  });

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [excelFile, setExcelFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          throw new Error("User is not authenticated");
        }
        const headers = { Authorization: `Bearer ${token}` };

        const [teacherResponse, subjectResponse] = await Promise.all([
          axios.get("https://localhost:7104/api/teacher", { headers }),
          axios.get("https://localhost:7104/api/subject", { headers }),
        ]);
        setTeachers(teacherResponse.data);
        setSubjects(subjectResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };
      const data = new FormData();
      console.log(formData);

      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Append file if available
      if (excelFile) {
        data.append("file", excelFile);
      }
      console.log(data);
      await axios.post("https://localhost:7104/api/class/create", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Make sure the content type is multipart
        },
      });

      alert("Class created successfully!");
      navigate("/class");
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class. Please try again.");
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
        maxWidth: 400,
        margin: "auto",
        mt: 4,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" textAlign="center">
        Create Class
      </Typography>
      <TextField
        label="Class Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Start Date"
        name="startDate"
        type="date"
        value={formData.startDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        required
      />
      <TextField
        label="End Date"
        name="endDate"
        type="date"
        value={formData.endDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        required
      />
      <Select
        name="teacherId"
        value={formData.teacherId}
        onChange={handleChange}
        displayEmpty
        fullWidth
        required
      >
        <MenuItem value="" disabled>
          Select a Teacher
        </MenuItem>
        {teachers.map((teacher) => (
          <MenuItem key={teacher.id} value={teacher.id}>
            {teacher.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        name="subjectId"
        value={formData.subjectId}
        onChange={handleChange}
        displayEmpty
        fullWidth
        required
      >
        <MenuItem value="" disabled>
          Select a Subject
        </MenuItem>
        {subjects.map((subject) => (
          <MenuItem key={subject.id} value={subject.id}>
            {subject.name}
          </MenuItem>
        ))}
      </Select>
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Import Students (Excel)
        </Typography>
        <label htmlFor="upload-file" style={{ cursor: "pointer" }}>
          <input
            type="file"
            id="upload-file"
            style={{ display: "none" }}
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
          <Button variant="contained" component="span">
            Choose File
          </Button>
        </label>
        {excelFile && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected File: {excelFile.name}
          </Typography>
        )}
      </Box>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Create Class
      </Button>
    </Box>
  );
};

export default CreateClass;
