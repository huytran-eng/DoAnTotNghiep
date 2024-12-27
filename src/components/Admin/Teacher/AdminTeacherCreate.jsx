import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    Box,
  } from "@mui/material";
import {baseUrl} from "../../../util/constant";

const AdminTeacherCreate = () => {
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState({
        name:"",
        email: "",
        address: "",
        phone: "",
        departmentId: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(()=>{
        fetchDepartments();
    }, []);

    const fetchDepartments = async() => {
        try{
            const response = await axios.get(baseUrl + "Department/GetAll", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDepartments(response.data);
        } catch (error){
            console.error("Error fetching departments:", error);
            if(error.response?.status === 401 ){
                alert("Please login again");
                window.location.href = "/login";
            }
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setTeachers({ ...teachers, [name]: value});
    };

    const handleCreateTeacher = async (e) => {
      e.preventDefault();
      setLoading(true);
    
      // Kiểm tra dữ liệu đầu vào
      if (!teachers.name || !teachers.email || !teachers.departmentId) {
        alert("Please fill in all required fields.");
        setLoading(false);
        return;
      }
    
      try {
        await axios.post(baseUrl + "teacher/create", teachers, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Teacher created successfully!");
        navigate("/admin/teacher");
      } catch (error) {
        console.error("Error creating teacher:", error.response?.data || error.message);
        alert("An error occurred while creating the teacher.");
        
      } finally {
        setLoading(false);
      }
    };

    return (
        <Box
          component="form"
          onSubmit={handleCreateTeacher}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "80%",
            margin: "auto",
            mt: 4,
            p: 3,
            border: "1px solid #ccc",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" textAlign="center">
            Create Teacher
          </Typography>
    
          <TextField
            label="Tên giang vien"
            name="name"
            value={teachers.name}
            onChange={handleInputChange}
            fullWidth
            required
          />
    
          <TextField
            label="email"
            name="email"
            
            value={teachers.email}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            label="Address"
            name="address"
            value={teachers.address}
            onChange={handleInputChange}
            
            fullWidth
          />
          <TextField
            label="phone"
            name="phone"
            value={teachers.phone}
            onChange={handleInputChange}
            
            fullWidth
          />
          <Select
            label="Khoa"
            name="departmentId"
            value={teachers.departmentId}
            onChange={handleInputChange}
            fullWidth
            displayEmpty
            required
          >
            <MenuItem value="" disabled>
              Chọn khoa
            </MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>

          <Button type="submit" variant="contained" color="primary" fullWidth>
        {loading ? "Creating..." : "Create Teacher"}
      </Button>
    </Box>
  );
};

export default AdminTeacherCreate;


