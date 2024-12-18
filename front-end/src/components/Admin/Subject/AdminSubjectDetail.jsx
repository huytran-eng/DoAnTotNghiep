/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../util/constant";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@mui/icons-material";

const AdminSubjectDetail = () => {
  const [activeTab, setActiveTab] = useState(0); // Track active tab index
  const [subjectDetails, setSubjectDetails] = useState(null); // Subject details data
  const [exercises, setExercises] = useState([]);
  const [materials, setMaterials] = useState([]); // Study materials data
  const [classes, setClasses] = useState([]); // Subject classes data
  const [loading, setLoading] = useState(false); // Loading state
  const [allExercises, setAllExercises] = useState([]); // All available exercises
  const token = localStorage.getItem("token"); // Retrieve JWT token
  const { id } = useParams();
  const navigate = useNavigate();

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
      const response = await axios.get(baseUrl + `subject/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubjectDetails(response.data);
    } catch (error) {
      console.error("Error fetching subject details:", error);
    }
  };

  // Fetch study materials
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + `subject/${id}/materials`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const response = await axios.get(baseUrl + `subject/${id}/classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
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
      const response = await axios.get(baseUrl + `subject/${id}/exercises`, {
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

  // Fetch all available exercises
  const fetchAllExercises = async () => {
    try {
      const response = await axios.get(baseUrl + `exercise`, {
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
      await axios.post(baseUrl + `subject/addExercise`, addExerciseDTO, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  const handleViewClassDetails = (rowData) => {
    navigate(`/admin/class/${rowData.id}`);
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
      flex: 1,
      renderCell: (params) => (
        <button onClick={() => handleViewClassDetails(params.row)}>
          <Visibility style={{ color: "#1976d2" }} />
        </button>
      ),
    },
  ];
  const unusedExercises = useMemo(() => {
    return allExercises.filter((exercise) => {
      return (
        exercises.find((item) => item.title === exercise.title) === undefined
      );
    });
  }, [allExercises, exercises]);
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
            {unusedExercises.length > 0 ? (
              unusedExercises.map((exercise) => (
                <MenuItem value={exercise.id} key={exercise.id}>
                  {exercise.title}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Không có bài tập nào mới</MenuItem>
            )}
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
      valueGetter: (value) => {
        if (!value) {
          return "N/A";
        }
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
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
    <div>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Chi tiết môn học
      </Typography>
      {/* Subject Details Box */}
      <Grid container spacing={3} sx={{ height: "100%" }}>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "150px auto", // First column fixed width, second auto
              rowGap: 1.5, // Gap between rows
              columnGap: 2,
              p: 2,
              mb: 3,
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {subjectDetails ? (
              <>
                <Box
                  sx={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {subjectDetails.name}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Số tín chỉ:
                </Typography>
                <Typography variant="body1">{subjectDetails.credit}</Typography>

                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Khoa:
                </Typography>
                <Typography variant="body1">
                  {subjectDetails.departmentName}
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Số lớp đang mở:
                </Typography>
                <Typography variant="body1">
                  {subjectDetails.numberOfClasses}
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Mô tả:
                </Typography>
                <Typography variant="body1">
                  {subjectDetails.description}
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Danh sách chủ đề:
                </Typography>
                <Box>
                  <List disablePadding>
                    {subjectDetails.topics.map((topic) => (
                      <ListItem key={topic.id} disablePadding>
                        <ListItemText primary={`- ${topic.name}`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </>
            ) : (
              <Typography>Loading subject details...</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
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
                <Button
                  onClick={handleAddExercise}
                  variant="contained"
                  color="primary"
                >
                  Thêm bài tập
                </Button>

                <DataGrid
                  rows={exercises}
                  columns={exerciseColumns}
                  autoHeight // This makes the grid resize automatically based on its content
                  pageSize={5}
                  loading={loading}
                  sx={{
                    mt: 2,
                    minHeight: 400,
                    maxHeight: "80vh",
                    width: "100%",
                  }} // Adjust height dynamically, with a max height of 80% of the viewport height
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
        </Grid>{" "}
      </Grid>
    </div>
  );
};

export default AdminSubjectDetail;
