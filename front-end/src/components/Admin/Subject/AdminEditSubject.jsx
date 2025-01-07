/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";
import { baseUrl } from "../../../util/constant";
import Swal from 'sweetalert2';

const AdminEditSubject = () => {
  const [departments, setDepartments] = useState([]);
  const [programmingLanguages, setProgrammingLanguages] = useState([]);
  const [subjectProgrammingLanguageIds, setSubjectProgrammingLanguageIds] =
    useState([]);
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
  const { id } = useParams(); // Get subject ID from URL parameters
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartments();
    fetchProgrammingLanguages();
    fetchSubjectDetails();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + "Department/GetAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgrammingLanguages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + "ProgrammingLanguage/GetAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgrammingLanguages(response.data);
    } catch (error) {
      console.error("Error fetching programming languages:", error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + `subject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setSubject(response.data);
      const programmingLanguageIds =
        response.data.subjectProgrammingLanguageDTOs.map(
          (spl) => spl.programmingLanguageId
        );
      setSubjectProgrammingLanguageIds(programmingLanguageIds);
    } catch (error) {
      console.error("Error fetching subject details:", error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      Swal.fire({
        title: "Thất bại",
        text: 'Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại',
        icon: "warning",
        confirmButtonText: "OK",
      });
      window.location.href = "/login";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubject({ ...subject, [name]: value });
  };

  const handleProgrammingLanguageChange = (event) => {
    const selectedIds = event.target.value;
    setSubjectProgrammingLanguageIds(selectedIds);
    setSubject({ ...subject, programmingLanguageIds: selectedIds });
  };

  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...subject.topics];
    updatedTopics[index][field] = value;
    setSubject((prevData) => ({ ...prevData, topics: updatedTopics }));
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

  const handleUpdateSubject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(subject)
      await axios.post(baseUrl + `subject/edit/${id}`, subject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        title: 'Thành công',
        text: 'Cập nhật môn học thành công',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate(`/admin/subject/${id}`);
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while creating the teacher.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading || !subject || !departments || !programmingLanguages) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
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
        onSubmit={handleUpdateSubject}
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
          Chỉnh sửa môn học
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
          name="departmentId"
          value={subject.departmentId || ""}
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
          value={subjectProgrammingLanguageIds || []}
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
              value={topic.name}
              onChange={(e) => handleTopicChange(index, "name", e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Mô tả"
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
          {loading ? "Updating..." : "Cập nhật môn học"}
        </Button>
      </Box>
    </Box>
  );
};

export default AdminEditSubject;
