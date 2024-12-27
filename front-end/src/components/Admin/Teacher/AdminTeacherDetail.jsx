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
  Modal,
} from "@mui/material";

const AdminTeacherDetail = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const token = localStorage.getItem("token");
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchTeacherDetail();
    fetchTeacherClasses();
  }, []);

  useEffect(() => {
    if(activeTab === 1){
      fetchTeacherClasses();
    }
  }, [activeTab]);


  const fetchTeacherDetail = async () => {
    setLoading(true);
    try{
      const response =  await axios.get(baseUrl + `teacher/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if(response.data){
        setTeacher(response.data);
      }
    } catch (error){
      console.error("Error fetching teacher details:", error);
    } finally{
      setLoading(false);
    }
  };

  const fetchTeacherClasses = async () => {
    setLoading(true);
    try{
      const response = await axios.get(baseUrl + `teacher/${id}/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if(response.data){
        setTeacherClasses(response.data);
      }
    } catch(error){
      console.error("Error fetching teacher classes:", error);
    } finally{
      setLoading(false);
    }

      
    };


  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if(!teacher) {
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
    
    { field: "name", headerName: "Tên giang vien", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "address", headerName: "Dia chi", width: 300 },
    { field: "phone", headerName: "So dien thoai", width: 300 },
  ];

  return (
    <div>
      <Typography variant="h5" align="center">
        Thông tin giao vien
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Thông tin sinh viên" />
              <Tab label="Danh sách các lớp theo học" />
              
            </Tabs>
          </Box>
        </Grid>
        <Grid item xs={12}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6">{student.name}</Typography>
              {/* Các thông tin chi tiết */}
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
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {selectedRow && (
            <SyntaxHighlighter language="javascript" style={themeEditor}>
              {selectedRow.code}
            </SyntaxHighlighter>
          )}
        </Box>
      </Modal>
    </div>
  );


    
  };
  
  export default AdminTeacherDetail;