/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Box, Typography, IconButton } from "@mui/material";
import { baseUrl } from "../../../util/constant";
import { Visibility } from "@mui/icons-material";
import Swal from "sweetalert2";

const TeacherStudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Retrieve JWT token

  useEffect(() => {
    fetchStudents();
  }, []);

  // Function to fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + `student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      if (error.response?.status === 401) {
        Swal.fire({
          title: "Thất bại",
          text: 'Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại',
          icon: "warning",
          confirmButtonText: "OK",
        });
        window.location.href = "/login"; // Redirect to login page
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "studentIdString", headerName: "Mã sinh viên", flex: 1 },
    { field: "name", headerName: "Họ và tên", flex: 1.5 },
    {
      field: "birthDate",
      headerName: "Ngày sinh",
      flex: 1,
      valueGetter: (value) => {
        if (!value) {
          return "N/A";
        }
        return moment(value).format("DD/MM/YYYY");
      },
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Địa chỉ", flex: 1 },
    { field: "phone", headerName: "Số điện thoại", flex: 1 },
    {
      flex: 1,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleViewDetails(params.row)}
          sx={{ mr: 1 }}
        >
          <Visibility /> {/* View icon */}
        </IconButton>
      ),
    },
  ];

  const handleViewDetails = (rowData) => {
    navigate(`/teacher/student/${rowData.id}`);
  };

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Danh sách sinh viên
      </Typography>
      <Box
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={students}
            columns={columns}
            pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
            loading={loading}
          />
        </div>
      </Box>
    </div>
  );
};

export default TeacherStudentList;
