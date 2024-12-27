/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Button, IconButton } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";
import { baseUrl } from "../../../util/constant";

const TeacherExerciseList = () => {
  const [exercises, setExercises] = useState([]); // List of exercises
  const [loading, setLoading] = useState(false); // Loading state
  const token = localStorage.getItem("token"); // JWT token
  const navigate = useNavigate();
  // Fetch exercises
  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + "exercise", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  // Columns for DataGrid
  const exerciseColumns = [
    { field: "title", headerName: "Tiêu đề", flex: 1 },
    { field: "difficulty", headerName: "Độ khó", flex: 1 },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      flex: 1,
      valueGetter: (value) => {
        if (!value) {
          return "N/A";
        }
        // Convert the decimal value to a percentage
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleViewExercise(params.row.id)}
            sx={{ mr: 1 }}
          >
            <Visibility /> {/* View icon */}
          </IconButton>
        </div>
      ),
    },
  ];

  // Navigate to create exercise page

  const handleViewExercise = (id) => {
    navigate(`/teacher/exercise/${id}`);
  };

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Danh sách bài tập
      </Typography>

      {/* Exercises List */}
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
            rows={exercises}
            columns={exerciseColumns}
            sx={{ minHeight: 400, width: "100%" }}
            loading={loading}
          />
        </div>
      </Box>
    </div>
  );
};

export default TeacherExerciseList;
