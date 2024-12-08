/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios"; // Use Axios for simplified HTTP requests
import { DataGrid } from "@mui/x-data-grid";
import "../styles/homeStyles.css"; // Optional styles for the layout
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../util/constant";

const Monhoc = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Retrieve JWT token
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Function to fetch subjects
  const fetchSubjects = async () => {
    console.log("here");
    setLoading(true);
    try {
      const response = await axios.get(baseUrl+`subject`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      const items = response.data;
      setSubjects(items);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        // Redirect to login page
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "name", headerName: "Tên Môn", width: 400 },
    { field: "credit", headerName: "Số tín chỉ", width: 200 },
    { field: "departmentName", headerName: "Tên khoa", width: 200 },
    { field: "numberOfClasses", headerName: "Số lượng lớp", width: 200 },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <button onClick={() => handleViewDetails(params.row)}>Xem</button>
      ),
    },
  ];

  const handleViewDetails = (rowData) => {
    navigate(`/subject/${rowData.id}`);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-container" style={{ padding: "20px" }}>
      <h2 className="header-title">DANH SÁCH MÔN HỌC</h2>

      {/* Material-UI DataGrid */}
      <div
        className="mt-5"
        style={{
          height: 400,
          width: "80%", // Adjust the width to your desired size
          maxWidth: "1200px", // Optional max-width for the table
          margin: "0 auto", // Center the table horizontally
        }}
      >
        <DataGrid
          rows={subjects} // The data for the table
          columns={columns} // The columns to display
          pageSizeOptions={[5, 10, 25, { value: -1, label: "All" }]}
        />
      </div>
    </div>
  );
};

export default Monhoc;
