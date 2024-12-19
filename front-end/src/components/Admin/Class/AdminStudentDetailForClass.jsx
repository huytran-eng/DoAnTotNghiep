/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { baseUrl } from "../../../util/constant";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  IconButton,
  Table,
  TableHead,
  TableBody,
  tableCellClasses,
  styled,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Modal,
  Button,
} from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useParams, useNavigate } from "react-router-dom";
import nullImage from "../../../assets/image/null_light.png";
import { vs as themeEditor } from "react-syntax-highlighter/dist/esm/styles/prism";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
        setSubmissionHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching submission history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/admin/class/${id}`); // Navigate back to the class view
  };

  return (
    <div
      className="content-container"
      style={{ padding: "20px", width: "80%", margin: "0 auto" }}
    >
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Lịch sử nộp bài của sinh viên
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
            {studentDetails ? (
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
            ) : (
              <Typography>Loading student details...</Typography>
            )}
          </Box>
        </Grid>

        {/* Right Column (Tabs and DataGrids) */}
        <Grid item xs={12} sm={8}>
          {submissionHistory && submissionHistory.length !== 0 ? (
            <TableContainer
              component={Paper}
              sx={{
                width: "full",
                borderRadius: 0,
                borderEndEndRadius: "0.5rem",
                boxShadow: "none",
                height: "100%",
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow sx={{ padding: 0, fontSize: "1rem" }}>
                    <TableCell
                      sx={{
                        padding: 0,
                        height: 32,
                        fontFamily: "inherit",
                        color: "#3c3c4399",
                      }}
                      align="center"
                    >
                      Trạng thái
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: 0,
                        height: 32,
                        fontFamily: "inherit",
                        color: "#3c3c4399",
                      }}
                      align="center"
                    >
                      Ngôn ngữ
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: 0,
                        height: 32,
                        fontFamily: "inherit",
                        color: "#3c3c4399",
                      }}
                      align="center"
                    >
                      Ngày nộp
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: 0,
                        height: 32,
                        fontFamily: "inherit",
                        color: "#3c3c4399",
                      }}
                      align="center"
                    >
                      Thời gian chạy
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: 0,
                        height: 32,
                        fontFamily: "inherit",
                        color: "#3c3c4399",
                      }}
                      align="center"
                    >
                      Bộ nhớ
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissionHistory.map((row, index) => (
                    <StyledTableRow
                      key={index}
                      onClick={() => handleOpen(row)}
                      sx={{ cursor: "pointer" }}
                    >
                      <StyledTableCell
                        align="center"
                        sx={{
                          color:
                            row.status === 0
                              ? "green" // AC status
                              : row.status === 1 || row.status === 2
                              ? "red" // WA and RE status
                              : row.status === 3
                              ? "yellow" // TLE status
                              : "inherit", // Default color
                        }}
                      >
                        {row.status === 0
                          ? "AC"
                          : row.status === 1
                          ? "WA"
                          : row.status === 2
                          ? "RE"
                          : row.status === 3
                          ? "TLE"
                          : "Unknown"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.programmingLanguage}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {new Date(row.submitDate).toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.executionTime} ms
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {(row.memoryUsed / (1024 * 1024)).toFixed(2)} MB
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
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
            </TableContainer>
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
