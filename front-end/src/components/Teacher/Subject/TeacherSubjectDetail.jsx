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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../util/constant";
import { useNavigate } from "react-router-dom";
import { Visibility,Download } from "@mui/icons-material";
import Swal from "sweetalert2";
const TeacherSubjectDetail = () => {
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
  const [openDialog, setOpenDialog] = useState(false);
  const [materialName, setMaterialName] = useState("");
  const [file, setFile] = useState(null);

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
  const handleMaterialNameChange = (e) => {
    setMaterialName(e.target.value);
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitStudyMaterial = async () => {
    if (!materialName || !file) {
      Swal.fire({
        title: "Thất bại",
        text: 'Please enter all fields',
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);

    // Create FormData object to send file and other data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", materialName);
    formData.append("subjectId", id);
    try {
      // Replace with your API endpoint for creating study material
      const response = await axios.post(
        baseUrl + "studymaterial/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200 || response.status === 204) {
        handleCloseDialog();
        Swal.fire({
          title: "Thành công",
          text: "Tạo tài liệu học tập thành công!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setMaterialName("");
          setFile(null);
          fetchMaterials();
        });
      } else {
        // Handle other non-success statuses
        Swal.fire({
          title: "Có lỗi xảy ra!",
          text: "Không thể tạo tài liệu học tập.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error uploading study material", error);

      // Handle API error response and display appropriate message
      const errorMessage =
        error.response?.data?.message || // Custom message returned from API
        "Đã có lỗi xảy ra khi tạo tài liệu học tập.";

      const statusCode = error.response?.status;

      // Show SweetAlert popup with error message based on status code
      if (statusCode === 400) {
        Swal.fire({
          title: "Bad Request",
          text: errorMessage,
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else if (statusCode === 401) {
        Swal.fire({
          title: "Unauthorized",
          text: "You are not authorized. Please log in again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Lỗi hệ thống",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setLoading(false);
    }
  };
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

  const handleDownloadMaterial = async (materialId) => {
    try {
      const response = await axios.get(
        baseUrl + `studymaterial/download/${materialId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important for downloading files
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "material.pdf"); // or extract the filename from response headers
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading material:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể tải xuống tài liệu.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
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
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  // Columns for DataGrid
   const materialColumns = [
      { field: "title", headerName: "Tiêu đề tài liệu", flex: 1 },
      {
        field: "createdAt",
        headerName: "Ngày tạo",
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
          <Button
            onClick={() => handleDownloadMaterial(params.row.id)}
          >
            <Download style={{ color: "#1976d2" }} />
          </Button>
        ),
      },
    ];

  const classColumns = [
    { field: "name", headerName: "Tên lớp", flex: 1 },
    { field: "subjectName", headerName: "Tên môn học", flex: 1.5 },
    { field: "teacherName", headerName: "Tên giảng viên", flex: 1 },
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
                <Button
                  onClick={handleOpenDialog}
                  variant="contained"
                  color="primary"
                >
                  Thêm tài liệu cho môn học
                </Button>

                <DataGrid
                  rows={materials}
                  columns={materialColumns}
                  autoHeight
                  pageSize={5}
                  loading={loading}
                />

                {/* Dialog for adding study material */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogTitle>Thêm tài liệu</DialogTitle>
                  <DialogContent>
                    <TextField
                      label="Tên tài liệu"
                      fullWidth
                      value={materialName}
                      onChange={handleMaterialNameChange}
                      margin="normal"
                    />
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      style={{ width: "100%" }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSubmitStudyMaterial}
                      color="primary"
                      disabled={loading}
                    >
                      {loading ? "Đang tải..." : "Thêm tài liệu"}
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            )}
          </div>
        </Grid>{" "}
      </Grid>
    </div>
  );
};

export default TeacherSubjectDetail;
