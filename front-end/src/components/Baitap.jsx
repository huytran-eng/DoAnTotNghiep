/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Button, IconButton } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Visibility, Edit } from "@mui/icons-material";
const Exercises = () => {
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
      const response = await axios.get("https://localhost:7104/api/exercise", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  // Columns for DataGrid
  const exerciseColumns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "difficulty", headerName: "Difficulty", flex: 1 },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      flex: 1,
      valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY"),
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
          <IconButton
            color="secondary"
            onClick={() => handleUpdateExercise(params.row.id)}
          >
            <Edit /> {/* Edit icon */}
          </IconButton>
        </div>
      ),
    },
  ];

  // Navigate to create exercise page
  const handleCreateExercise = () => {
    navigate("/exercise/create");
  };

  const handleViewExercise = (id) => {
    navigate(`/exercise/${id}`);
  };

  // Navigate to Update Exercise page
  const handleUpdateExercise = (id) => {
    navigate(`/exercise/update/${id}`);
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="content-container" style={{ padding: "20px" }}>
      <Typography variant="h4" component="h2">
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateExercise}
        >
          Tạo bài tập
        </Button>
        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={exercises}
            columns={exerciseColumns}
            pageSize={5}
            getRowId={(row) => row.id}
          />
        </div>
      </Box>
    </div>
  );
};

export default Exercises;
