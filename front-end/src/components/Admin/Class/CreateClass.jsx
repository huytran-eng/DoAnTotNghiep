/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
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
} from "@mui/material";
import { baseUrl } from "../../../util/constant";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const CreateClass = () => {
  const [formData, setFormData] = useState({
    name: "",
    startDate: dayjs(),
    endDate: dayjs(),
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
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(baseUrl + 'subject', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }finally{
      setLoading(false);
    }
  };

  const fetchTeachers = async (departmentId) => {
    try {
      const response = await axios.get(baseUrl + `teacher/department/${departmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubjectChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, subjectId: value, teacherId: '' });

    const selectedSubject = subjects.find((subject) => subject.id === value);
    if (selectedSubject) {
      console.log(selectedSubject)
      fetchTeachers(selectedSubject.departmentId);
    }
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };
  const handleStartDateChange = (date) => {
    if (date) {
      setFormData((prevData) => ({
        ...prevData,
        startDate: date,
      }));
    };
  };

  const handleEndDateChange = (date) => {
    if (date) {
      setFormData((prevData) => ({
        ...prevData,
        endDate: date,
      }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        throw new Error("User is not authenticated");
      }
      
      const data = new FormData();
      console.log(formData);
      // Append form data
      if( formData.startDate > formData.endDate){
        Swal.fire({
          title: "Lỗi",
          text: "Ngày bắt đầu phải sau ngày kết thúc",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'startDate' || key === 'endDate') {
          data.append(key, dayjs(value).format('YYYY-MM-DD')); // Format the date to string date-time
        } else {
          data.append(key, value);
        }
      });

      // Append file if available
      if (excelFile) {
        data.append("file", excelFile);
      }
      await axios.post(baseUrl+"class/create", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Make sure the content type is multipart
        },
      });
      Swal.fire({
        title: "Thành công",
        text: "Tạo lớp học thành công",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/class");
    } catch (error) {
      console.error("Error creating class:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Failed to create class. Please try again!",
        icon: "error",
        confirmButtonText: "OK",
      });
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
        margin: "auto",
        mt: 4,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" textAlign="center">
        Tạo lớp học
      </Typography>
      <TextField
        label="Tên lớp học"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Ngày bắt đầu"
          value={formData.startDate} // This should be a dayjs object
          onChange={handleStartDateChange}
          renderInput={(params) => <TextField {...params} fullWidth required />}
          format="DD/MM/YYYY" // Correct format
        />
      </LocalizationProvider>
      
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Ngày kết thúc"
          value={formData.endDate} // This should be a dayjs object
          onChange={handleEndDateChange}
          renderInput={(params) => <TextField {...params} fullWidth required />}
          format="DD/MM/YYYY" // Correct format
        />
      </LocalizationProvider>

      <Select
        name="subjectId"
        value={formData.subjectId}
        onChange={handleSubjectChange}
        displayEmpty
        fullWidth
        required
      >
        <MenuItem value="" disabled>
          Chọn môn học
        </MenuItem>
        {subjects.map((subject) => (
          <MenuItem key={subject.id} value={subject.id}>
            {subject.name}
          </MenuItem>
        ))}
      </Select>

      <Select
        name="teacherId"
        value={formData.teacherId}
        onChange={handleChange}
        displayEmpty
        fullWidth
        required
      >
        <MenuItem value="" disabled>
          Chọn giáo viên
        </MenuItem>
        {teachers.map((teacher) => (
          <MenuItem key={teacher.id} value={teacher.id}>
            {teacher.name}
          </MenuItem>
        ))}
      </Select>
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Nhập danh sách sinh viên (Excel)
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
            Chọn file
          </Button>
        </label>
        {excelFile && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected File: {excelFile.name}
          </Typography>
        )}
      </Box>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Tạo lớp học
      </Button>
    </Box>
  );
};

export default CreateClass;
