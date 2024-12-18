/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { baseUrl } from "../../../util/constant";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AdminClassDetail = () => {
  const [activeTab, setActiveTab] = useState(0); // Track active tab index
  const [classDetails, setClassDetails] = useState(null); // Class details data
  const [students, setStudents] = useState([]); // Students data
  const [topics, setTopics] = useState([]); // Opened topics data
  const [loading, setLoading] = useState(false); // Loading state
  const [availableTopics, setAvailableTopics] = useState([]);
  const token = localStorage.getItem("token"); // Retrieve JWT token
  const { id } = useParams(); // Get class ID from URL
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [materials, setMaterials] = useState([]);
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
      console.log(id);
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
      console.log(response.data);
      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseClick = (exerciseId) => {
    if (user.position === "Student") {
      // Navigate to exercise for student
      navigate(`/class/${id}/exercise/${exerciseId}`);
    } else if (user.position === "Admin" || user.position === "Teacher") {
      // Navigate to exercise detail for Admin/Teacher
      navigate(`/class/${id}/exerciseDetail/${exerciseId}`);
    }
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + `class/${id}/materials`, {
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

  const handleOpenTopic = () => {
    fetchAllClassTopics();
    setTopics((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        startDate: null,
        endDate: null,
        isNew: true, // Mark as new for editing
      },
    ]);
  };

  const handleSaveTopic = async (row) => {
    try {
      var formData = {
        classId: id,
        topicId: row.topicId,
        startDate: row.startDate,
        endDate: row.endDate,
      };
      console.log(formData);
      await axios.post(baseUrl + `class/opentopic`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTopics();
    } catch (error) {
      console.error("Error saving topic:", error);
    }
  };

  const handleEditRowChange = (id, field, value) => {
    console.log(id, field, value);
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === id ? { ...topic, [field]: value } : topic
      )
    );
  };

  const handleTopicExpand = (topicId) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  // Columns for DataGrid
  const studentColumns = [
    { field: "studentIdString", headerName: "Mã sinh viên", flex: 1 },
    { field: "name", headerName: "Họ và tên", flex: 1.5 },
    {
      field: "birthDate",
      headerName: "Ngày sinh",
      flex: 1,
      valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY"),
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Địa chỉ", flex: 1 },
    { field: "phone", headerName: "Số điện thoại", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      // renderCell: (params) => (
      //   <button onClick={() => handleViewDetails(params.row)}>View</button>
      // ),
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
    { field: "title", headerName: "Title", width: 300 },
    { field: "description", headerName: "Description", width: 500 },
    { field: "fileType", headerName: "File Type", width: 150 },
    {
      field: "uploadedOn",
      headerName: "Uploaded On",
      width: 200,
      valueGetter: (value) => {
        if (!value) {
          return "N/A";
        }
        return moment(value).format("DD/MM/YYYY");
      },
    },
  ];

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Chi tiết lớp học
      </Typography>
      <Grid container spacing={3}>
        {/* Left Column (Class Details) */}
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

        {/* Right Column (Tabs and DataGrids) */}
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

          {/* Tab Content */}
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
    </div>
  );
};
export default AdminClassDetail;
