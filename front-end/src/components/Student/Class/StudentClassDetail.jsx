/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Tabs, Tab, Grid, IconButton } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { baseUrl } from "../../../util/constant";
import { Visibility } from "@mui/icons-material";

const StudentClassDetail = () => {
  const [activeTab, setActiveTab] = useState(0); // Track active tab index
  const [classDetails, setClassDetails] = useState(null); // Class details data
  const [students, setStudents] = useState([]); // Students data
  const [topics, setTopics] = useState([]); // Opened topics data
  const [materials, setMaterials] = useState([]); // Class study materials
  const [loading, setLoading] = useState(false); // Loading state
  const token = localStorage.getItem("token"); // Retrieve JWT token
  const { id } = useParams(); // Get class ID from URL
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();
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

  const handleViewStudent = (studentId) => {
    navigate(`/class/${id}/student/${studentId}`);
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      // const response = await axios.get(
      //   baseUrl+`class/${id}/materials`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      // setMaterials(response.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
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
          <Visibility /> {/* View icon */}
        </IconButton>
      ),
    },
  ];

  const topicColumns = [
    {
      field: "name",
      headerName: "Tên chủ đề",
      flex: 1,
    },
    {
      field: "startDate",
      headerName: "ngày mở",
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
      headerName: "ngày đóng",
      flex: 1,
      valueGetter: (value) => {
        if (!value) {
          return "N/A";
        }
        return moment(value).format("DD/MM/YYYY");
      },
    },
  ];

  const exerciseColumns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "difficulty", headerName: "Difficulty", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <button onClick={() => handleExerciseClick(params.row.id)}>
          View Exercises
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
    <div
      className="content-container"
      style={{ padding: "20px", width: "80%", margin: "0 auto" }}
    >
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
              <DataGridPro
                rows={topics}
                columns={topicColumns}
                autoHeight
                pageSize={5}
                loading={loading}
                getRowId={(row) => row.id} // Ensure unique row IDs
                getDetailPanelContent={({ row }) => (
                  <Box sx={{ padding: 2 }}>
                    <DataGrid
                      rows={row.classExerciseListDTOs || []}
                      columns={exerciseColumns}
                      autoHeight
                      pageSize={5}
                    />
                  </Box>
                )}
              />
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
export default StudentClassDetail;
