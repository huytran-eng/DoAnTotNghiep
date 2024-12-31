import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../util/constant";
import { useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

const AdminTeacherDetail = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTeacherDetail();
  }, []);

  const fetchTeacherDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}teacher/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setTeacher(response.data);
        setTeacherClasses(response.data.classes || []);
      }
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
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

  if (!teacher) {
    return (
      <Typography variant="h6" align="center" color="error">
        Không tìm thấy thông tin giảng viên.
      </Typography>
    );
  }

  const classColumns = [
    { field: "name", headerName: "Tên lớp", flex: 1 },
    { field: "subjectName", headerName: "Môn học", flex: 1 },
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
    { field: "numberOfStudent", headerName: "Số lượng học viên", flex: 1 },
    { field: "status", headerName: "Trạng thái", flex: 1 },
  ];

  return (
    // <div>
    //   <Typography variant="h5" align="center" gutterBottom>
    //     Thông tin giảng viên
    //   </Typography>
    //   <Grid container spacing={3}>
    //     <Grid item xs={12}>
    //       <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
    //         <Tabs value={activeTab} onChange={handleTabChange} centered>
    //           <Tab label="Thông tin giảng viên" />
    //           <Tab label="Danh sách các lớp giảng dạy" />
    //         </Tabs>
    //       </Box>
    //     </Grid>
    //     <Grid item xs={12}>
    //       {activeTab === 0 && (
    //         <Box>
    //           <Typography variant="h6">Tên: {teacher.name}</Typography>
    //           <Typography>Username: {teacher.username}</Typography>
    //           <Typography>Email: {teacher.email}</Typography>
    //           <Typography>Địa chỉ: {teacher.address}</Typography>
    //           <Typography>Số điện thoại: {teacher.phone}</Typography>
    //           <Typography>Ngày sinh: {teacher.birthDate || "Không có"}</Typography>
    //           <Typography>
    //             Số lượng lớp: {teacher.numberOfClasses}
    //           </Typography>
    //         </Box>
    //       )}
    //       {activeTab === 1 && (
    //         <DataGrid
    //           rows={teacherClasses}
    //           columns={classColumns}
    //           pageSize={5}
    //           autoHeight
    //           getRowId={(row) => row.id}
    //         />
    //       )}
    //     </Grid>
    //   </Grid>
    // </div>

    <div>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Thông tin giảng viên
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
            {teacher ? (
              <>
                <Box
                  sx={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {teacher.name}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Username:
                </Typography>
                <Typography variant="body1">{teacher.username}</Typography>

                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Email:
                </Typography>
                <Typography variant="body1">{teacher.email}</Typography>

                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Địa chỉ:
                </Typography>
                <Typography variant="body1">{teacher.address}</Typography>

                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Số điện thoại:
                </Typography>
                <Typography variant="body1">{teacher.phone}</Typography>

                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Ngày sinh:
                </Typography>
                <Typography variant="body1">
                  {moment(teacher.birthDate ).format("DD/MM/YYYY")}
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Số lượng lớp:
                </Typography>
                <Typography variant="body1">
                  {teacher.numberOfClasses}
                </Typography>
              </>
            ) : (
              <Typography>Loading subject details...</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <div>
            <DataGrid
              rows={teacherClasses}
              columns={classColumns}
              pageSize={5}
              autoHeight
              getRowId={(row) => row.id}
            />
          </div>
        </Grid>{" "}
      </Grid>
    </div>
  );
};

export default AdminTeacherDetail;
