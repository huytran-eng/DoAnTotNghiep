/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import {baseUrl} from "../../../util/constant";
const AdminCreateSubject = () => {
  const [departments, setDepartments] = useState([]);
  const [programmingLanguages, setProgrammingLanguages] = useState([]);
  const [subject, setSubject] = useState({
    name: "",
    credit: 0,
    description: "",
    departmentId: "",
    programmingLanguageIds: [],
    topics: [{ name: "", description: "" }],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartments();
    fetchProgrammingLanguages();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        baseUrl+"Department/GetAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        window.location.href = "/login";
      }
    }
  };

  const fetchProgrammingLanguages = async () => {
    try {
      const response = await axios.get(
        baseUrl+"ProgrammingLanguage/GetAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProgrammingLanguages(response.data);
    } catch (error) {
      console.error("Error fetching programming languages:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        window.location.href = "/login";
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubject({ ...subject, [name]: value });
  };

  const handleProgrammingLanguageChange = (event) => {
    setSubject({
      ...subject,
      programmingLanguageIds: event.target.value,
    });
  };

  const handleTopicChange = (index, field, value) => {
    console.log(subject);
    const updatedTopics = [...subject.topics];
    updatedTopics[index][field] = value;
    setSubject((prevData) => ({
      ...prevData,
      topics: updatedTopics,
    }));
  };

  const addTopic = () => {
    setSubject((prevData) => ({
      ...prevData,
      topics: [...prevData.topics, { name: "", description: "" }],
    }));
  };

  const handleRemoveTopic = (index) => {
    const updatedTopics = [...subject.topics];
    updatedTopics.splice(index, 1);
    setSubject({ ...subject, topics: updatedTopics });
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("tao lop hoc");
      console.log(subject);
      await axios.post(baseUrl+"subject/create", subject, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Subject created successfully!");
      navigate("/admin/subject");
    } catch (error) {
      console.error("Error creating subject:", error);
      alert("Failed to create subject.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleCreateSubject}
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
        Tạo môn học
      </Typography>

      <TextField
        label="Tên môn học"
        name="name"
        value={subject.name}
        onChange={handleInputChange}
        fullWidth
        required
      />

      <TextField
        label="Số tín chỉ"
        name="credit"
        type="number"
        value={subject.credit}
        onChange={handleInputChange}
        fullWidth
        required
      />
      <TextField
        label="Mô tả"
        name="description"
        value={subject.description}
        onChange={handleInputChange}
        multiline
        rows={4}
        fullWidth
      />
      <Select
        label="Khoa"
        name="departmentId"
        value={subject.departmentId}
        onChange={handleInputChange}
        fullWidth
        displayEmpty
        required
      >
        <MenuItem value="" disabled>
          Chọn khoa
        </MenuItem>
        {departments.map((dept) => (
          <MenuItem key={dept.id} value={dept.id}>
            {dept.name}
          </MenuItem>
        ))}
      </Select>

      <Select
        name="programmingLanguageIds"
        value={subject.programmingLanguageIds}
        onChange={handleProgrammingLanguageChange}
        multiple
        fullWidth
        displayEmpty
        required
      >
        <MenuItem value="" disabled>
          Chọn các ngôn ngữ lập trình
        </MenuItem>
        {programmingLanguages.map((lang) => (
          <MenuItem key={lang.id} value={lang.id}>
            {lang.name}
          </MenuItem>
        ))}
      </Select>
      <Typography variant="h6">Chủ đề</Typography>

      {subject.topics.map((topic, index) => (
        <Box key={index} sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Tên chủ đề"
            name={`name-${index}`}
            value={topic.name}
            onChange={(e) => handleTopicChange(index, "name", e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Mô tả"
            name={`description-${index}`}
            value={topic.description}
            onChange={(e) =>
              handleTopicChange(index, "description", e.target.value)
            }
            fullWidth
            required
            multiline
          />

          <Button
            variant="outlined"
            color="error"
            onClick={() => handleRemoveTopic(index)}
            sx={{ alignSelf: "flex-end" }}
          >
            Remove
          </Button>
        </Box>
      ))}

      <Button variant="outlined" onClick={addTopic} sx={{ mb: 2 }}>
        Thêm chủ đề
      </Button>

      <Button type="submit" variant="contained" color="primary" fullWidth>
        {loading ? "Creating..." : "Tạo môn học"}
      </Button>
    </Box>
  );
};

export default AdminCreateSubject;
