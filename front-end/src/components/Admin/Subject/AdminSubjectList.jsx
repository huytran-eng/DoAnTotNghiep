/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios"; // Use Axios for simplified HTTP requests
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "../../../styles/homeStyles.css";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { Visibility, Edit } from "@mui/icons-material";
import { baseUrl } from "../../../util/constant";

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
      const response = await axios.get(baseUrl + `subject`, {
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

  const handleEditSubject = (id) => {
    navigate(`/admin/subject/edit/${id}`);
  };

  const columns = [
    { field: "name", headerName: "Tên Môn", flex: 1 },
    { field: "credit", headerName: "Số tín chỉ", flex: 1 },
    { field: "departmentName", headerName: "Tên khoa", flex: 1 },
    { field: "numberOfClasses", headerName: "Số lượng lớp", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleViewDetails(params.row.id)}
            sx={{ mr: 1 }}
          >
            <Visibility />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleEditSubject(params.row.id)}
          >
            <Edit /> {/* Edit icon */}
          </IconButton>
        </div>
      ),
    },
    // {
    //   width: 150,
    //   renderCell: (params) => (
    //     <div>
    //       <IconButton
    //         color="primary"
    //         onClick={() => h handleViewDetails(params.row)}
    //         sx={{ mr: 1 }}
    //       >
    //         <Visibility /> {/* View icon */}
    //       </IconButton>
    //       <IconButton
    //         color="secondary"
    //         onClick={() => handleEditExercise(params.row.id)}
    //       >
    //         <Edit /> {/* Edit icon */}
    //       </IconButton>
    //     </div>
    //   ),
  ];

  const handleViewDetails = (id) => {
    navigate(`/admin/subject/${id}`);
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
