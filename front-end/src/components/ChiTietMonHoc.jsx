import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Sidebar from "./Layout/DefaultLayout/Sidebar";
import Header from "./Layout/DefaultLayout/Header";
import moment from "moment";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";

const SubjectDetail = () => {
  const [activeTab, setActiveTab] = useState(0); // Track active tab index
  const [subjectDetails, setSubjectDetails] = useState(null); // Subject details data
  const [exercises, setExercises] = useState([]);
  const [materials, setMaterials] = useState([]); // Study materials data
  const [classes, setClasses] = useState([]); // Subject classes data
  const [loading, setLoading] = useState(false); // Loading state
  const [allExercises, setAllExercises] = useState([]); // All available exercises
  const token = localStorage.getItem("token"); // Retrieve JWT token
  const { id } = useParams();

  useEffect(() => {
    fetchSubjectDetails();
  }, []);

  useEffect(() => {
    if (activeTab === 0) {
      fetchClasses();
    } else if (activeTab === 1) {
      fetchExercises();
      fetchAllExercises();
    } else {
      fetchMaterials();
    }
  }, [activeTab]);

  // Fetch subject details
  const fetchSubjectDetails = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7104/api/subject/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubjectDetails(response.data);
    } catch (error) {
      console.error("Error fetching subject details:", error);
    }
  };

  // Fetch study materials
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://localhost:7104/api/subject/${id}/materials`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subject classes
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://localhost:7104/api/subject/${id}/classes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response)
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subject exercises
  const fetchExercises = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://localhost:7104/api/subject/${id}/exercises`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available exercises
  const fetchAllExercises = async () => {
    try {
      const response = await axios.get(`https://localhost:7104/api/exercise`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllExercises(response.data);
    } catch (error) {
      console.error("Error fetching all exercises:", error);
    }
  };

  const saveNewExercise = async (exercise) => {
    try {
      const addExerciseDTO = {
        SubjectId: subjectDetails.id, // Assuming `id` is the subject ID
        ExerciseId: exercise.exerciseId, // Assuming exercise contains an `exerciseId` property
        TopicId: exercise.topicId, // Assuming exercise contains a `topicId` property
      };
      await axios.post(
        `https://localhost:7104/api/subject/addExercise`,
        addExerciseDTO,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchExercises();
    } catch (error) {
      console.error("Error saving exercise:", error);
    }
  };

  // Add new exercise
  const handleAddExercise = () => {
    setExercises((prev) => [
      ...prev,
      { id: Date.now(), name: "", topicId: "", added: true },
    ]);
  };

  // Update new exercise data
  const handleExerciseChange = (id, field, value) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  // Columns for DataGrid
  const materialColumns = [
    { field: "title", headerName: "Title", width: 300 },
    { field: "description", headerName: "Description", width: 500 },
    { field: "fileType", headerName: "File Type", width: 150 },
    { field: "uploadedOn", headerName: "Uploaded On", width: 200 },
  ];

  const classColumns = [
    { field: "name", headerName: "Tên lớp", flex: 1 },
    { field: "subjectName", headerName: "Tên môn học", flex: 1.5 },
    { field: "teacherName", headerName: "Tên giáo viên", flex: 1 },
    { field: "numberOfStudent", headerName: "Sĩ số", flex: 0.5 },
    {
      field: "startDate",
      headerName: "Ngày bắt đầu",
      flex: 1,
      valueFormatter: params => 
        moment(params?.value).format("DD/MM/YYYY"),
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      flex: 1,
      valueFormatter: params => 
        moment(params?.value).format("DD/MM/YYYY"),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <button onClick={() => handleViewDetails(params.row)}>View</button>
      ),
    },
  ];
  const exerciseColumns = [
    {
      field: "title", // Replace "name" with "exerciseName"
      headerName: "Tên bài tập", // Update the header to reflect "Exercise Name"
      flex: 1,
      renderCell: (params) =>
        params.row.added ? (
          <Select
            value={params.row.exerciseId || ""}
            onChange={(e) =>
              handleExerciseChange(params.row.id, "exerciseId", e.target.value)
            }
            fullWidth
            size="small"
          >
            {allExercises.map((exercise) => (
              <MenuItem value={exercise.id} key={exercise.id}>
                {exercise.title}{" "}
                {/* Assuming the exercise name is in the 'title' field */}
              </MenuItem>
            ))}
          </Select>
        ) : (
          params.row.exerciseName // Display the exercise name if not added
        ),
    },
    {
      field: "topicName",
      headerName: "Chủ đề",
      flex: 1,
      renderCell: (params) =>
        params.row.added ? (
          <Select
            value={params.row.topicId || ""}
            onChange={(e) =>
              handleExerciseChange(params.row.id, "topicId", e.target.value)
            }
            fullWidth
            size="small"
          >
            {subjectDetails.topics.map((topic) => (
              <MenuItem value={topic.id} key={topic.id}>
                {topic.name}
              </MenuItem>
            ))}
          </Select>
        ) : (
          params.row.topic
        ),
    },
    {
      field: "difficulty",
      headerName: "Độ khó",
      flex: 1,
    },
    {
      field: "addedDate",
      headerName: "Ngày thêm",
      flex: 1,
      valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY"),
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) =>
        params.row.added ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => saveNewExercise(params.row)}
          >
            Save
          </Button>
        ) : null,
    },
  ];
  return (
    <div className="content-container" style={{ padding: "20px" }}>
      <Typography variant="h4" component="h2">
        Chi tiết môn học
      </Typography>

      {/* Subject Details Box */}
      <Box
        className="mt-3"
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {subjectDetails ? (
          <>
            <Typography variant="h6" gutterBottom>
              {subjectDetails.name}
            </Typography>
            <Typography variant="body1">
              <strong>Số tín chỉ:</strong> {subjectDetails.credit}
            </Typography>
            <Typography variant="body1">
              <strong>Khoa:</strong> {subjectDetails.departmentName}
            </Typography>
            <Typography variant="body1">
              <strong>Số lớp đang mở:</strong> {subjectDetails.numberOfClasses}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              <strong>Mô tả:</strong> {subjectDetails.description}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 2, display: "flex", alignItems: "center" }}
            >
              <strong>Danh sách chủ đề:</strong>
              <Box sx={{ ml: 2, minWidth: 300 }}>
                <Select
                  size="small"
                  fullWidth
                  value={
                    subjectDetails.topics.length > 0
                      ? subjectDetails.topics[0].id
                      : ""
                  }
                  onChange={() => {}}
                  displayEmpty
                >
                  {subjectDetails.topics.map((topic) => (
                    <MenuItem value={topic.id} key={topic.id}>
                      {topic.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Typography>
          </>
        ) : (
          <Typography>Loading subject details...</Typography>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          aria-label="Subject Details Tabs"
        >
          <Tab label="Các lớp học" />
          <Tab label="Danh sách bài tập" />
          <Tab label="Tài liệu môn học" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <div>
        {/* Tab Panels */}
        {activeTab === 0 && (
          <div>
            <DataGrid
              rows={classes}
              columns={classColumns}
              autoHeight
              pageSize={5}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <Button variant="contained" onClick={handleAddExercise}>
              Thêm bài tập cho môn học
            </Button>
            <DataGrid
              rows={exercises}
              columns={exerciseColumns}
              autoHeight
              pageSize={5}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <DataGrid
              rows={classes}
              columns={classColumns}
              autoHeight
              pageSize={5}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
