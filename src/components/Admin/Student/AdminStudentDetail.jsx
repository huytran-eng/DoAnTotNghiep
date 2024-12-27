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

const AdminTeacherDetail = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTeacherDetail();
    fetchTeacherClasses();
  }, []);

  const fetchTeacherDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}teacher/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setTeacher(response.data);
      }
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}teacher/${id}/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setTeacherClasses(response.data);
      }
    } catch (error) {
      console.error("Error fetching teacher classes:", error);
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

  const classColumns = [
    { field: "name", headerName: "Ten giao vien", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "address", headerName: "Dia chi", width: 300 },
    { field: "phone", headerName: "So dien thoai", width: 200 },
  ];

  return (
    <div>
      <Typography variant="h5" align="center">
        Thông tin giáo viên
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Thông tin giáo viên" />
              <Tab label="Danh sách lớp đang giảng dạy" />
            </Tabs>
          </Box>
        </Grid>
        <Grid item xs={12}>
          {activeTab === 0 && teacher && (
            <Box>
              <Typography variant="h6">Tên: {teacher.name}</Typography>
              <Typography>Email: {teacher.email}</Typography>
              <Typography>Địa chỉ: {teacher.address}</Typography>
              <Typography>Số điện thoại: {teacher.phone}</Typography>
              {/* Hiển thị thêm thông tin chi tiết nếu cần */}
            </Box>
          )}
          {activeTab === 1 && (
            <DataGrid
              rows={teacherClasses}
              columns={classColumns}
              pageSize={5}
              autoHeight
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminTeacherDetail;
