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
  IconButton
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { baseUrl } from "../../../util/constant";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TopicSelectionDialog from "./TopicSelectionDialog";
import { Visibility, Download } from "@mui/icons-material";

const AdminClassDetail = () => {
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

  const handleViewStudent = (studentId) => {
    navigate(`/admin/class/${id}/student/${studentId}`);
  };

  const handleExerciseClick = (exerciseId) => {
    if (user.position === "Student") {
      navigate(`/class/${id}/exercise/${exerciseId}`);
    } else if (user.position === "Admin" || user.position === "Teacher") {
      navigate(`/class/${id}/exerciseDetail/${exerciseId}`);
    }
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

  const handleSaveTopic = async (topicData) => {
    try {
      const formData = {
        classId: id,
        ...topicData,
      };

      await axios.post(baseUrl + "class/opentopic", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowTopicDialog(false);
      fetchTopics();
    } catch (error) {
      if (error.response.status === 400) {
        alert("Chủ đề đã được mở trong khoảng thời gian được chọn");
      }
      alert("Có lỗi xảy ra khi lưu chủ đề");
    }
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
      field: "action",
      headerName: "Action",
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
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <button onClick={() => handleExerciseClick(params.row.id)}>
          Xem thông tin bài tập
        </button>
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
          onChange={() =>
            handleToggleMaterial(params.row.id)
          }
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
              <DataGrid
                rows={materials}
                columns={materialColumns}
                autoHeight
                pageSize={5}
                loading={loading}
              />
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

export default AdminClassDetail;
