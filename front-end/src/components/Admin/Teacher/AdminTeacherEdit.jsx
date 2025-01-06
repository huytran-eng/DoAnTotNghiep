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
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Swal from "sweetalert2";

const AdminTeacherEdit = () => {
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    birthDate: dayjs(),
    departmentId: "",
  }); // State lưu trữ thông tin giáo viên
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false); // State để hiển thị spinner trong khi chờ (du lieu luon dc tai)
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy `id` giáo viên từ URL
  const token = localStorage.getItem("token"); // Token để xác thực API

  useEffect(() => {
    fetchTeacher();
    fetchDepartments();
  }, [id]); // useEffect chạy mỗi khi `id` thay đổi

  // Hàm gọi API lấy thông tin giáo viên
  const fetchTeacher = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}Teacher/${id}`, {
        // thực hiện một yêu cầu HTTP GET tới server de lay id teacher
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeacher({
        ...response.data,
        birthDate: dayjs(response.data.birthDate), //chuyển đổi định dạng chuỗi ngày tháng > dayjs
      });
    } catch (error) {
      console.error("Error fetching teacher:", error);
    } finally {
      setLoading(false); //tt off khi api goi xong
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(baseUrl + "Department/GetAll", {
        //endpoint lay all khoa
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(response.data);
    } catch (error) {
      //xu ly loi khi goi api
      console.error("Error detching departments:", error);
      if (error.response?.status === 401) {
        alert("Please login again!");
        window.location.href = "/login";
      }
    }
  };

  // Xử lý khi người dùng thay đổi thông tin trong các trường nhập liệu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacher((prevTeacher) => ({
      ...prevTeacher,
      [name]: value,
    }));
  };
  const handleBirthDateChange = (date) => {
    if (date) {
      setTeacher({
        ...teacher,
        birthDate: date, // Store dayjs object here, not a string
      });
    }
  };
  // Xử lý khi người dùng nhấn nút "Cập nhật"
  const handleUpdateTeacher = async (e) => {
    e.preventDefault(); // Ngăn reload trang mặc định của form
    try {
      const formattedTeacher = {
        ...teacher,
        birthDate: teacher.birthDate.format("YYYY-MM-DD"), // Định dạng lại ngày trước khi gửi lên server
      };
      await axios.put(`${baseUrl}Teacher/${id}`, formattedTeacher, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: "Thành công",
        text: "Cập nhật thông tin giảng viên thành công",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(`/admin/teacher/${id}`);
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Đã có lỗi xảy ra khi cập nhật thông tin giáo viên.";
      const statusCode = error.response?.status;

      // Show SweetAlert popup with error message based on status code
      if (statusCode === 400) {
        Swal.fire({
          title: "Thất bại",
          text: errorMessage,
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else if (statusCode === 404) {
        Swal.fire({
          title: "Không tìm thấy",
          text: errorMessage,
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
    }
  };

  // Nếu dữ liệu đang tải, hiển thị spinner
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleUpdateTeacher}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "50%",
        margin: "auto",
        mt: 4,
      }}
    >
      <Typography variant="h5" textAlign="center">
        Chỉnh sửa thông tin giáo viên
      </Typography>
      <TextField
        label="Tên giáo viên"
        name="name"
        value={teacher.name}
        onChange={handleInputChange}
        fullWidth
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        label="Email"
        name="email"
        value={teacher.email}
        onChange={handleInputChange}
        fullWidth
        required
      />
      <TextField
        label="Địa chỉ"
        name="address"
        value={teacher.address}
        onChange={handleInputChange}
        fullWidth
      />
      <TextField
        label="Số điện thoại"
        name="phone"
        value={teacher.phone}
        onChange={handleInputChange}
        fullWidth
      />
      {/* <TextField
        label="Ngày sinh"
        name="birthDate"
        type="date"
        value={teacher.birthDate.format("")}
        onChange={(e) =>
          setTeacher((prevTeacher) => ({
            ...prevTeacher,
            birthDate: dayjs(e.target.value),
          }))
        }
        fullWidth
        required
      /> */}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Ngày sinh"
          value={teacher.birthDate} // This should be a dayjs object
          onChange={handleBirthDateChange}
          renderInput={(params) => <TextField {...params} fullWidth required />}
          format="DD/MM/YYYY" // Correct format
        />
      </LocalizationProvider>
      <Select
        name="departmentId"
        value={teacher.departmentId}
        onChange={handleInputChange}
        fullWidth
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
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Cập nhật thông tin
      </Button>
    </Box>
  );
};

export default AdminTeacherEdit;
