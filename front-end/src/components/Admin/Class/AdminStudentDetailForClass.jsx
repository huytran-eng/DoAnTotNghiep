/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { baseUrl } from "../../../util/constant";
import {
  Box,
  Typography,
  Grid,
  Modal,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useParams, useNavigate } from "react-router-dom";
import nullImage from "../../../assets/image/null_light.png";
import { vs as themeEditor } from "react-syntax-highlighter/dist/esm/styles/prism";
import moment from "moment";
import { Visibility } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  maxHeight: "90vh",
  overflowY: "auto",
};

const AdminStudentDetailForClass = () => {
  const [loading, setLoading] = useState(false); // Loading state
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token"); // Retrieve JWT token
  const { id, studentId } = useParams();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();
  useEffect(() => {
    fetchStudentDetail();
    fetchStudentSubmissionDetail();
  }, []);

  const handleClose = () => {
    setSelectedRow(null);
    setOpen(false);
  };

  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const fetchStudentDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        baseUrl + `class/${id}/student/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        setStudentDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch submission history
  const fetchStudentSubmissionDetail = async () => {
    setLoading(true);
    try {
      console.log();
      const response = await axios.get(
        baseUrl + `class/${id}/student-submission/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        console.log(response.data)
        setSubmissionHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching submission history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/teacher/class/${id}`); // Navigate back to the class view
  };

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
    { field: "executionTime", headerName: "Thời gian chạy (ms)", flex: 1 },
    {
      field: "memoryUsed",
      headerName: "Bộ nhớ (MB)",
      flex: 1,
      valueGetter: (value) => (value / (1024 * 1024)).toFixed(2),
    },
    {
      flex: 0.5,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleOpen(params.row)}
          sx={{ mr: 1 }}
        >
          <Visibility /> {/* View icon */}
        </IconButton>
      ),
    },
  ];
  if (!studentDetails) {
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
    <div>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Thông tin sinh viên  lớp {studentDetails.className}
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
            <>
              <Typography variant="h6" gutterBottom>
                {studentDetails.name}
              </Typography>
              <Typography variant="body1">
                <strong>Mã sinh viên</strong> {studentDetails.studentIdString}
              </Typography>
              <Typography variant="body1">
                <strong>Tên lớp:</strong> {studentDetails.className}
              </Typography>
              <Typography variant="body1">
                <strong>Môn học:</strong> {studentDetails.subjectName}
              </Typography>
              <Typography variant="body1">
                <strong>Số bài tập đã nộp:</strong>{" "}
                {studentDetails.exercisesDone}
              </Typography>
              <Typography variant="body1">
                <strong>Số bài tập làm đúng:</strong>{" "}
                {studentDetails.exercisesCorrect}
              </Typography>
            </>
          </Box>
        </Grid>

        {/* Right Column (Tabs and DataGrids) */}
        <Grid item xs={12} sm={8} mt={3}>
          {submissionHistory && submissionHistory.length !== 0 ? (
            <DataGrid
              rows={submissionHistory}
              columns={submissionColumns}
              autoHeight
              pageSize={5}
              loading={loading}
            />
          ) : loading ? (
            <div>Loading...</div>
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <img className="w-[200px]" src={nullImage} alt="null" />
              <h1 className="text-[#3c3c4399]">Không có lịch sử nộp bài</h1>
            </div>
          )}
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoBack}
        sx={{ marginBottom: 2 }}
      >
        Quay lại lớp học
      </Button>
    </div>
  );
};
export default AdminStudentDetailForClass;
