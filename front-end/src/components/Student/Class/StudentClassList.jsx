/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios"; // Use Axios for simplified HTTP requests
import { DataGrid } from "@mui/x-data-grid";
import "../../../styles/homeStyles.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "../../../styles/studentClassList.css";
import {baseUrl} from "../../../util/constant";

const StudentClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Retrieve JWT token
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    fetchClasses();
  }, []);

  // Function to fetch classes
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        baseUrl+`class/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        window.location.href = "/login"; // Redirect to login page
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "name",
      headerClassName: "datagrid-header",
      headerName: "Tên lớp",
      flex: 1,
    },
    {
      field: "subjectName",
      headerClassName: "datagrid-header",
      headerName: "Tên môn học",
      flex: 1.5,
    },
    {
      field: "teacherName",
      headerClassName: "datagrid-header",
      headerName: "Tên giáo viên",
      flex: 1,
    },
    {
      field: "numberOfStudent",
      headerClassName: "datagrid-header",
      headerName: "Sĩ số",
      flex: 0.5,
    },
    {
      field: "startDate",
      headerName: "Ngày bắt đầu",
      flex: 1,
      headerClassName: "datagrid-header",
      valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY"),
    },
    {
      field: "endDate",
      headerName: "Ngày kết thúc",
      flex: 1,
      headerClassName: "datagrid-header",
      valueFormatter: (params) => moment(params?.value).format("DD/MM/YYYY"),
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

  const handleViewDetails = (rowData) => {
    navigate(`/class/${rowData.id}`);
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="content-container" style={{ padding: "20px" }}>
      <h2 className="text-center display-6">Danh sách các lớp đang theo học</h2>
      <div
        className="mt-5"
        style={{
          height: 400,
          width: "80%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <DataGrid
          rows={classes}
          columns={columns}
          pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
        />
      </div>
    </div>
  );
};

export default StudentClassList;
