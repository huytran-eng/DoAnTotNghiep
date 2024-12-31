import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import { baseUrl } from "../../../util/constant";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Swal from 'sweetalert2';

const AdminTeacherCreate = () => {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    birthDate: dayjs(),
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(baseUrl + "Department/GetAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      if (error.response?.status === 401) {
        alert("Please login again");
        window.location.href = "/login";
      }
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeachers({ ...teachers, [name]: value });
  };

  const handleBirthDateChange = (date) => {
    if (date) {
      setTeachers({
        ...teachers,
        birthDate: date, // Store dayjs object here, not a string
      });
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!teachers.name || !teachers.email || !teachers.birthDate) {
      alert("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const formattedTeacher = {
        ...teachers,
        birthDate: dayjs(teachers.birthDate).format("YYYY-MM-DD"), // Format the birthDate to a normal date string
      };
      await axios.post(baseUrl + "teacher/create", formattedTeacher, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: 'Thành công',
        text: 'Tạo giảng viên thành công',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/admin/teacher');
      });
    } catch (error) {
      Swal.fire({
        title: 'Thất bại',
        text: 'Xảy ra lỗi khi tạo giảng viên.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleCreateTeacher}
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
        Thêm giảng viên
      </Typography>

      <TextField
        label="Tên giảng viên"
        name="name"
        value={teachers.name}
        onChange={handleInputChange}
        fullWidth
        required
      />
      <TextField
        label="Email"
        name="email"
        value={teachers.email}
        onChange={handleInputChange}
        fullWidth
        required
      />
      <TextField
        label="Địa chỉ"
        name="address"
        value={teachers.address}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField
        label="Số điện thoại"
        name="phone"
        value={teachers.phone}
        onChange={handleInputChange}
        fullWidth
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Ngày sinh"
          value={teachers.birthDate} // This should be a dayjs object
          onChange={handleBirthDateChange}
          renderInput={(params) => <TextField {...params} fullWidth required />}
          format="DD/MM/YYYY" // Correct format
        />
      </LocalizationProvider>
      {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
        <DatePicker
          label="Ngày sinh"
          value={teachers.birthDate}
          // onChange={handleDateChange}
          renderInput={(params) => (
            <TextField {...params} fullWidth required />
          )}
          inputFormat="dd/MM/yyyy"
        />
      </LocalizationProvider> */}
      {/* <TextField
        label="Ngày sinh"
        name="birthDate"
        type="date"
        value={teachers.birthDate}
        onChange={handleInputChange}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        required
      /> */}
      <Select
        label="Khoa"
        name="departmentId"
        value={teachers.departmentId || ""} 
        onChange={handleInputChange}
        fullWidth
        displayEmpty
        required
      >
        {/* Placeholder */}
        <MenuItem value="" disabled>
          Chọn khoa
        </MenuItem>
        {/* Render department options */}
        {departments.map((dept) => (
          <MenuItem key={dept.id} value={dept.id}>
            {dept.name}
          </MenuItem>
        ))}
      </Select>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {loading ? "Đang tạo..." : "Thêm giảng viên"}
      </Button>
    </Box>
  );
};

export default AdminTeacherCreate;
