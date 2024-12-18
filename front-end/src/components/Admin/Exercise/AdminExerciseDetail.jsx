import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Tabs,
  Tab,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
} from "@mui/material";
import { baseUrl } from "../../../util/constant";

const AdminExerciseDetail = () => {
  const { id } = useParams(); // Get exercise ID from the URL
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // For managing tab state
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch exercise details
    const fetchExerciseData = async () => {
      try {
        if (!token) {
          throw new Error("User is not authenticated");
        }
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${baseUrl}exercise/${id}`, {
          headers,
        });
        console.log(response.data)
        setExercise(response.data);
      } catch (error) {
        console.error("Error fetching exercise details:", error);
        alert("Failed to fetch exercise details.");
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, [id, token]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading || !exercise) {
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
      sx={{
        width: "80%",
        margin: "auto",
        mt: 4,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
        Chi tiết bài tập
      </Typography>

      {/* Tabs for Exercise Details and Test Cases */}
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Chi tiết bài tập" />
        <Tab label="Test Cases" />
      </Tabs>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box sx={{ mt: 3 }}>
          {/* Exercise Details */}
          <Typography variant="h6" gutterBottom>
            Thông tin bài tập
          </Typography>
          <TextField
            label="Tiêu đề"
            value={exercise.title}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Đề bài"
            value={exercise.description}
            multiline
            rows={6}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Yêu cầu"
            value={exercise.requirements}
            multiline
            rows={4}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Độ khó"
            value={
              exercise.difficulty === 1
                ? "Dễ"
                : exercise.difficulty === 2
                ? "Trung bình"
                : "Khó"
            }
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Giới hạn thời gian (giây)"
            value={exercise.timeLimit}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Giới hạn không gian (kB)"
            value={exercise.spaceLimit}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ mt: 3 }}>
          {/* Test Cases */}
          <Typography variant="h6" gutterBottom>
            Danh sách Test Cases
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Đầu vào</TableCell>
                  <TableCell>Đầu ra mong đợi</TableCell>
                  <TableCell>Ẩn</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exercise.testCases && exercise.testCases.length > 0 ? (
                  exercise.testCases.map((testCase, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <TextField
                          multiline
                          rows={2}
                          value={testCase.input}
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          multiline
                          rows={2}
                          value={testCase.expectedOutput}
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={testCase.isHidden} disabled />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Không có test case nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default AdminExerciseDetail;
