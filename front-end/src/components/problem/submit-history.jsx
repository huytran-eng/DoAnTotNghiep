/* eslint-disable react/prop-types */
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Modal, styled, Typography } from "@mui/material";
import nullImage from "../../assets/image/null_light.png";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs as themeEditor } from "react-syntax-highlighter/dist/esm/styles/prism";
import { sortSubmissionsByDateDescending } from "../../util/sortSubmision";

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

export default function SubmitHistory({ submissionHistory }) {
  const [open, setOpen] = useState(false);
  console.log(submissionHistory);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedRow(null);
    setOpen(false);
  };

  return (
    <>
      {submissionHistory.length !== 0 ? (
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
              {sortSubmissionsByDateDescending(submissionHistory).map(
                (row, index) => (
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
                )
              )}
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
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <img className="w-[200px]" src={nullImage} alt="null" />
          <h1 className="text-[#3c3c4399]">Không có lịch sử nộp bài</h1>
        </div>
      )}
    </>
  );
}
