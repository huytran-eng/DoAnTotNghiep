/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { baseUrl } from "../util/constant";
const ExerciseDetail = () => {
  const { id } = useParams(); // Get exercise ID from URL
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // Fetch exercise details
  useEffect(() => {
    fetchExerciseDetails();
  }, []);

  const fetchExerciseDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        baseUrl+`exercise/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExercise(response.data);
    } catch (error) {
      console.error("Error fetching exercise details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!exercise) {
    return <div>Exercise not found.</div>;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" component="h2">
        {exercise.title}
      </Typography>
      <Typography variant="body1" mt={2}>
        <strong>Description:</strong> {exercise.description}
      </Typography>
      <Typography variant="body1" mt={2}>
        <strong>Difficulty:</strong> {exercise.difficulty}
      </Typography>
      <Typography variant="body1" mt={2}>
        <strong>Created At:</strong>{" "}
        {moment(exercise.createdAt).format("DD/MM/YYYY")}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/exercise")}
        sx={{ mt: 3 }}
      >
        Back to List
      </Button>
    </Box>
  );
};

export default ExerciseDetail;
