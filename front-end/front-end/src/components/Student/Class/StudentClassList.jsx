/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios"; // Use Axios for simplified HTTP requests
import { DataGrid } from "@mui/x-data-grid";
import "../../../styles/homeStyles.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "../../../styles/studentClassList.css";
import { baseUrl } from "../../../util/constant";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Visibility } from "@mui/icons-material";

const StudentClassList = () => {
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
        alert("Session expired. Please log in again.");
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
      headerName: "Tên giáo viên",
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
            color = "green";
            text = "Đang mở";
            break;
          case 2:
            color = "red";
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
    navigate(`/class/${rowData.id}`);
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-6 h-[calc(100vh-64px)]" >
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Danh sách các lớp đang theo học
      </Typography>
      <Box
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          height: '90%'
        }}
      >
        <div className="h-full">
          <DataGrid
            mt-2
            rows={classes}
            columns={columns}
            pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
          />
        </div>
      </Box>
    </div>
  );
};

export default StudentClassList;
