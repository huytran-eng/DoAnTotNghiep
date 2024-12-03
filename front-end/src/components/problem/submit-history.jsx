import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Modal, styled, Typography } from "@mui/material";
import nullImage from "../../assets/image/null_light.png";
import { useState } from "react";
function createData(name, calories, fat, carbs) {
  return { name, calories, fat, carbs };
}
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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflowY: 'auto',
  };
const rows = [
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 9.0, 37),
  createData("AC", "Java", 16.0, 24),
  createData("TLE", "Java", 3.7, 67),
  createData("WA", "Java", 16.0, 40),
  createData("AC", "Java", 6.0, 40),
  createData("AC", "Java", 9.0, 37),
  createData("AC", "Java", 16.0, 20),
  createData("TLE", "Java", 3.7, 63),
  createData("WA", "Java", 16.0, 49),
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 6.0, 24),
  createData("AC", "Java", 6.0, 24),
];
const SubmitHistory = () => {
    const [open, setOpen] = useState(false);
     const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  return rows.length !== 0 ? (
    <TableContainer
      component={Paper}
      sx={{ width: "full", borderRadius: 0, boxShadow: "none", height: "100%" }}
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
          {rows.map((row) => (
            <StyledTableRow
              key={row.carbs}
              sx={{ "&:last-child td, &:last-child th": { border: 0, cursor: 'pointer' } }}
              onClick={() => handleOpen()}
            >
              <StyledTableCell
                component="th"
                scope="row"
                sx={{
                  border: "none",
                  height: "48px",
                  padding: 0,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
                align="center"
              >
                <div className={` ${row.name === "AC" ? 'text-[#00a650]' : row.name === "TLE" ? 'text-[#ffa116]':'text-[#ff0000]'} `}>{row.name}</div>
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  border: "none",
                  height: "48px",
                  padding: 0,
                  color: "#262626bf",
                  fontSize: "14px",
                  cursor: 'pointer'
                }}
                align="center"
              >
                {row.calories}
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  border: "none",
                  height: "48px",
                  padding: 0,
                  color: "#262626bf"
                  ,
                  cursor: 'pointer'
                }}
                align="center"
              >
                {row.fat} ms
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  border: "none",
                  height: "48px",
                  padding: 0,
                  color: "#262626bf",
                  cursor: 'pointer'
                }}
                align="center"
              >
                {row.carbs} MB
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.  
          </Typography>
        </Box>
      </Modal>
    </TableContainer>
  ) : (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <img className="w-[200px]" src={nullImage} alt="null" />
      <h1 className="text-[#3c3c4399]">Không có lịch sử nộp bài</h1>
    </div>
  );
};

export default SubmitHistory;
