import axios from "axios";

import { use, useEffect } from "react";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../../util/constant";

import { Visibility } from "@mui/icons-material";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";


const AdminTeacherList = () => {
    const [teachers, setTeachers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchTeachers(currentPage);
    }, []);

    const fetchTeachers = async(page) => {
        console.log("here");
        setLoading(true);
        try{
            const response = await axios.get(baseUrl+'teacher', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const items = response.data;
            setTeachers(items);
        } catch (error){
            console.error("Error fetching teachers:", error);
            if(error.response?.status == 401){
                alert("Please login again");
                window.location.href= "/login";
            }
        } finally{
            setLoading(false);
        }
    };

    const handleCreateTeacher = () => {
        navigate("/admin/teacher/create");
    };
    const handleViewDetails = (rowData) => {
        navigate(`/admin/teacher/${rowData.id}`);
      };

    const columns = [
        { field : "name", headerName : "Ten giang vien", flex:1 },
        { field : "email", headerName : "Email", flex:1 },
        { field : "address", headerName : "Dia chi", flex:1 },
        { field : "phone", headerName : "So dien thoai", flex:1 },

        { field : "action", headerName : "Action", width: 150, renderCell: (params) => (
            <button onClick={() => handleViewDetails(params.row)}> {" "}
            <Visibility style={{color: "#1976d2"}} />
            </button>
        ),
    },
];
    return (
        <div className="content-container" style={{padding: "20px"}}>
            <Typography variant="h4" component="h2" gutterBottom align="center">
                Danh sách giáo viên
            </Typography>
            <Box
                sx={{
                    p:2,
                    mb: 3,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick = {handleCreateTeacher}
                    sx={{mb:3}}
                >
                    Tao giao vien

                </Button>
                <div style={{height:400, width:"100%"}}>
                    <DataGrid
                        rows={teachers}
                        columns={columns}
                        pageSizeOptions={[5,10,25,{value: -1, label:"All"}]}
                    />

                </div>
                </Box>
                </div>
    );
};
export default AdminTeacherList;