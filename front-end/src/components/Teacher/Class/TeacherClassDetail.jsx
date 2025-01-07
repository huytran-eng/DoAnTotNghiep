/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { baseUrl } from "../../../util/constant";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TopicSelectionDialog from "./TopicSelectionDialog";
import { Visibility, Download } from "@mui/icons-material";

const TeacherClassDetail = () => {
  const [toggleLoading, setToggleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [classDetails, setClassDetails] = useState(null);
  const [students, setStudents] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableTopics, setAvailableTopics] = useState([]);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [openedTopics, setOpenedTopics] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [materialName, setMaterialName] = useState("");
  const [file, setFile] = useState(null);

  // Thêm states mới
  const [showTopicDialog, setShowTopicDialog] = useState(false);

  useEffect(() => {
    fetchClassDetails();
  }, []);

  useEffect(() => {
    if (activeTab === 0) {
      fetchStudents();
    } else if (activeTab === 1) {
      fetchTopics();
    } else {
      fetchMaterials();
    }
  }, [activeTab]);
  const handleMaterialNameChange = (e) => {
    setMaterialName(e.target.value);
  };
  const fetchClassDetails = async () => {
    try {
      const response = await axios.get(baseUrl + `class/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClassDetails(response.data);
    } catch (error) {
      console.error("Error fetching class details:", error);
    }
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
    console.log(classDetails)
    formData.append("file", file);
    formData.append("title", materialName);
    formData.append("subjectId", classDetails.subjectId);
    console.log(formData);
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
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + `class/${id}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllClassTopics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + `class/${id}/alltopics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAvailableTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + `class/${id}/topics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTopics(response.data);
      setOpenedTopics(response.data); // Lưu danh sách chủ đề đã mở
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleViewStudent = (studentId) => {
    navigate(`/Teacher/class/${id}/student/${studentId}`);
  };

  const handleExerciseClick = (exerciseId) => {
     navigate(`/Teacher/exercise/${exerciseId}`);
  };
  const handleToggleMaterial = async (materialId) => {
    setLoading(true);
    try {
      console.log(token);
      await axios.post(
        baseUrl + `class/${id}/materialtoggle/${materialId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchMaterials();
    } catch (error) {
      console.error("Error toggling study material:", error);
      Swal.fire({
        title: "Lỗi",
        text: "Không thể cập nhật trạng thái tài liệu.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + `class/${id}/studymaterials`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching study materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTopic = async () => {
    try {
      await fetchAllClassTopics();
      setShowTopicDialog(true);
    } catch (error) {
      console.error("Error loading available topics:", error);
    }
  };

  const handleTopicExpand = (topicId) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleSaveTopic = async (topicData) => {
    try {
      const formData = {
        classId: id,
        ...topicData,
      };

      const response = await axios.post(baseUrl + "class/opentopic", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Show success dialog using SweetAlert
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Chủ đề đã được mở thành công!",
        });
        setShowTopicDialog(false);
        fetchTopics();
      } else {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: response.data.message,
        });
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        // Show error dialog using SweetAlert
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: data || "Có lỗi xảy ra khi lưu chủ đề",
        });
      } else {
        // Handle unexpected errors (e.g., network issues)
        Swal.fire({
          icon: "error",
          title: "Thât bại",
          text: "Không thể kết nối tới máy chủ. Vui lòng thử lại.",
        });
      }
    }
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

  // Columns for DataGrid
  const studentColumns = [
    { field: "studentIdString", headerName: "Mã sinh viên", flex: 1 },
    { field: "name", headerName: "Họ và tên", flex: 1.5 },
    { field: "exercisesDone", headerName: "Số bài tập đã làm", flex: 1.5 },
    { field: "exercisesCorrect", headerName: "Số bài tập làm đúng", flex: 1.5 },
    {
      flex: 1,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleViewStudent(params.row.id)}
          sx={{ mr: 1 }}
        >
          <Visibility />
        </IconButton>
      ),
    },
  ];

  const exerciseColumns = [
    { field: "title", headerName: "Tên bài tập", flex: 1 },
    { field: "difficulty", headerName: "Độ khó", flex: 1 },
    {
      flex: 1,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleExerciseClick(params.row.exerciseId)}
          sx={{ mr: 1 }}
        >
          <Visibility />
        </IconButton>
        
      ),
    },
  ];

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
      field: "openDate",
      headerName: "Ngày mở",
      flex: 1,
      valueGetter: (value) => {
        if (!value) {
          return "N/A";
        }
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
      field: "isOpen",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params) => (
        <Switch
          checked={params.row.isOpen}
          onChange={() => handleToggleMaterial(params.row.id)}
          color="primary"
        />
      ),
    },
    {
      flex: 1,
      renderCell: (params) => (
        <Button onClick={() => handleDownloadMaterial(params.row.id)}>
          <Download style={{ color: "#1976d2" }} />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Chi tiết lớp học
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              p: 2,
              mb: 3,
              mt: 3,
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {classDetails ? (
              <>
                <Typography variant="h6" gutterBottom>
                  {classDetails.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Môn học:</strong> {classDetails.subjectName}
                </Typography>
                <Typography variant="body1">
                  <strong>Giảng viên:</strong> {classDetails.teacherName}
                </Typography>
                <Typography variant="body1">
                  <strong>Ngày bắt đầu:</strong>{" "}
                  {moment(classDetails.startDate).format("DD/MM/YYYY")}
                </Typography>
                <Typography variant="body1">
                  <strong>Ngày kết thúc:</strong>{" "}
                  {moment(classDetails.endDate).format("DD/MM/YYYY")}
                </Typography>
                <Typography variant="body1">
                  <strong>Sĩ số:</strong> {classDetails.numberOfStudent}
                </Typography>
              </>
            ) : (
              <Typography>Loading class details...</Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              aria-label="Class Details Tabs"
            >
              <Tab label="Danh sách sinh viên" />
              <Tab label="Chủ đề đã mở" />
              <Tab label="Tài liệu lớp học" />
            </Tabs>
          </Box>

          <div>
            {activeTab === 0 && (
              <DataGrid
                rows={students}
                columns={studentColumns}
                autoHeight
                pageSize={5}
                loading={loading}
              />
            )}

            {activeTab === 1 && (
              <div>
                <Button
                  onClick={handleOpenTopic}
                  variant="contained"
                  color="primary"
                >
                  Mở chủ đề
                </Button>
                <Box sx={{ mt: 3 }}>
                  {topics.map((topic) => (
                    <Accordion
                      key={topic.id}
                      expanded={expandedTopic === topic.id}
                      onChange={() => handleTopicExpand(topic.id)}
                      sx={{
                        marginBottom: 1,
                        "& .MuiAccordionSummary-content": {
                          display: "flex",
                          flexDirection: "column",
                        },
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">{topic.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {moment(topic.startDate).format("DD/MM/YYYY")} -{" "}
                          {moment(topic.endDate).format("DD/MM/YYYY")}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <DataGrid
                          rows={topic.classExerciseListDTOs || []}
                          columns={exerciseColumns}
                          autoHeight
                          pageSize={5}
                        />
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
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
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                  <DialogTitle>Thêm tài liệu cho môn học</DialogTitle>
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
        </Grid>
      </Grid>
      <TopicSelectionDialog
        open={showTopicDialog}
        onClose={() => setShowTopicDialog(false)}
        availableTopics={availableTopics}
        openedTopics={openedTopics}
        onSave={handleSaveTopic}
      />
    </div>
  );
};

export default TeacherClassDetail;
