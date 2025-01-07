import { useState, useEffect } from "react";
import axios from "axios"; // Use Axios for simplified HTTP requests
import { DataGrid } from "@mui/x-data-grid";
import "../../../styles/homeStyles.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Typography, Box, Button, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { baseUrl } from "../../../util/constant";
import Swal from "sweetalert2";

const AdminClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Retrieve JWT token
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    fetchClasses();
  }, []);

  // Function to fetch classes
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + `class/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      if (error.response?.status === 401) {
        Swal.fire({
          title: "Không thành công",
          text: "Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại",
          icon: "error",
          confirmButtonText: "OK",
        });
        window.location.href = "/login"; // Redirect to login page
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Tên lớp",
      flex: 1,
    },
    {
      field: "subjectName",
      headerName: "Tên môn học",
      flex: 1.5,
    },
    {
      field: "teacherName",
      headerName: "Tên giảng viên",
      flex: 1,
    },
    {
      field: "numberOfStudent",
      headerName: "Sĩ số",
      flex: 0.5,
    },
    {
      field: "startDate",
      headerName: "Ngày bắt đầu",
      flex: 1,
      valueGetter: (value) => {
        if (!value) {
          return "N/A";
        }
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      flex: 1,
      valueGetter: (value) => {
        if (!value) {
          return "N/A";
        }
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
      field: "status",
      headerName: "Tình trạng",
      width: 150,
      renderCell: (params) => {
        let color;
        let text;
        switch (params.row.status) {
          case 0:
            color = "yellow";
            text = "Chưa bắt đầu";
            break;
          case 1:
            color = "red";
            text = "Đang mở";
            break;
          case 2:
            color = "green";
            text = "Đã kết thúc";
            break;
          default:
            color = "black";
            text = "";
        }
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleViewDetails(params.row)}
            sx={{ mr: 1 }}
          >
            <Visibility />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleViewDetails = (rowData) => {
    navigate(`/admin/class/${rowData.id}`);
  };

  const handleCreateClass = () => {
    navigate("/admin/class/create");
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="content-container" style={{ padding: "20px" }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Danh sách lớp học
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateClass}
          sx={{ mb: 3 }}
        >
          Tạo lớp học
        </Button>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={classes}
            columns={columns}
            pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
          />
        </div>
      </Box>
    </div>
  );
};

export default AdminClassList;
