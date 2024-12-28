import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Tabs,
  Tab,
  Grid,
  Modal,
} from "@mui/material";
import { baseUrl } from "../../../util/constant"; // Ensure you have the correct URL constant
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { vs as themeEditor } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  maxHeight: "90vh",
  overflowY: "auto",
};

const AdminStudentDetail = () => {
  const { id } = useParams(); // Get student ID from the URL
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // For managing tab state
  const [studentClasses, setStudentClasses] = useState([]);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const token = localStorage.getItem("token");
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchStudentDetail();
    fetchStudentClasses();
    // fetchStudentSubmissionDetail();
  }, []);

  useEffect(() => {
    if (activeTab === 0) {
      fetchStudentClasses();
    } else if (activeTab === 1) {
      fetchStudentSubmissions();
    }
  }, [activeTab]);

  const OpenCode = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };
  const handleClose = () => {
    setSelectedRow(null);
    setOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const fetchStudentDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + `student/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setStudent(response.data);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + `student/${id}/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setStudentClasses(response.data);
      }
    } catch (error) {
      console.error("Error fetching student classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentSubmissions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(baseUrl + `student/${id}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setSubmissionHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching submission history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!student) {
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

  const classColumns = [
    {
      field: "name",
      headerName: "Tên lớp",
      flex: 1,
    },
    {
      field: "subjectName",
      headerName: "Tên môn học",
      flex: 1.5,
    },
    {
      field: "teacherName",
      headerName: "Tên giáo viên",
      flex: 1,
    },
    {
      field: "numberOfStudent",
      headerName: "Sĩ số",
      flex: 0.5,
    },
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
      field: "action",
      headerName: "Action",
      flex: 1,
      headerClassName: "datagrid-header",
      renderCell: (params) => (
        <button onClick={() => handleViewDetails(params.row)}>View</button>
      ),
    },
  ];

  const submissionColumns = [
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
      renderCell: (params) => {
        const statusColors = {
          0: "green", // AC
          1: "red", // WA
          2: "red", // RE
          3: "yellow", // TLE
        };
        const statusLabels = {
          0: "AC",
          1: "WA",
          2: "RE",
          3: "TLE",
        };
        return (
          <span style={{ color: statusColors[params.value] || "inherit" }}>
            {statusLabels[params.value] || "Unknown"}
          </span>
        );
      },
    },
    { field: "programmingLanguage", headerName: "Ngôn ngữ", width: 150 },
    {
      field: "submitDate",
      headerName: "Ngày nộp",
      flex: 1.5,

      valueGetter: (value) => {
        if (!value) {
          return "N/A";
        }
        // Convert the decimal value to a percentage
        return moment(value).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    { field: "executionTime", headerName: "Thời gian chạy (ms)", flex: 1, },
    {
      field: "memoryUsed",
      headerName: "Bộ nhớ (MB)",
      flex: 1,
      valueGetter: (value) => (value / (1024 * 1024)).toFixed(2),
    },
    {
      flex: 0.5,
      renderCell: (params) => (
        <button onClick={() => OpenCode(params.row)}>View</button>
      ),
    },
  ];

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Thông tin sinh viên
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
            {student ? (
              <>
                <Typography variant="h6" gutterBottom>
                  {student.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Student ID:</strong> {student.studentIdString}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {student.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Position:</strong> {student.position}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> {student.phone}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {student.address}
                </Typography>
              </>
            ) : (
              <Typography>Loading student details...</Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Danh sách các lớp theo học" />
              <Tab label="Lịch sử nộp bài" />
            </Tabs>
          </Box>

          <div>
            {activeTab === 0 && (
              <DataGrid
                rows={studentClasses}
                columns={classColumns}
                pageSize={5}
                loading={loading}
              />
            )}

            {activeTab === 1 && (
              <DataGrid
                rows={submissionHistory}
                columns={submissionColumns}
                autoHeight
                pageSize={5}
                loading={loading}
              />
            )}
          </div>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description">
            <SyntaxHighlighter
              language="cpp"
              style={themeEditor}
              showLineNumbers
            >
              {selectedRow?.code || "No code available"}
            </SyntaxHighlighter>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminStudentDetail;
