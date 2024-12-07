import React, { useState, useEffect } from "react";
import axios from "axios"; // Use Axios for simplified HTTP requests
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "../../../styles/homeStyles.css";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import { Visibility, Edit } from "@mui/icons-material";
const AdminSubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Retrieve JWT token
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSubjects(currentPage);
  }, []);

  // Function to fetch subjects
  const fetchSubjects = async (page) => {
    console.log("here");
    setLoading(true);
    try {
      const response = await axios.get(`https://localhost:7104/api/subject`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const items = response.data;
      setSubjects(items);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        // Redirect to login page
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = () => {
    navigate("/admin/subject/create");
  };

  const columns = [
    { field: "name", headerName: "Tên Môn", flex: 1 },
    { field: "credit", headerName: "Số tín chỉ", flex: 1 },
    { field: "departmentName", headerName: "Tên khoa", flex: 1 },
    { field: "numberOfClasses", headerName: "Số lượng lớp", flex: 1 },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <button onClick={() => handleViewDetails(params.row)}>
          {" "}
          <Visibility style={{ color: "#1976d2" }} />
        </button>
      ),
    },
  ];

  const handleViewDetails = (rowData) => {
    navigate(`/admin/subject/${rowData.id}`);
  };

  return (
    <div className="content-container" style={{ padding: "20px" }}>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Danh sách môn học
      </Typography>
      {/* Material-UI DataGrid */}
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
          onClick={handleCreateSubject}
          sx={{ mb: 3 }}
        >
          Tạo môn học
        </Button>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={subjects} // The data for the table
            columns={columns} // The columns to display
            pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
          />
        </div>
      </Box>
    </div>
  );
};

export default AdminSubjectList;
