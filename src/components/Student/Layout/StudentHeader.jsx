import * as React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoPtit from "../../../assets/image/logo/Logo_PTIT.jpg";

export function StudentHeader() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const userInfo = JSON.parse(storedUserInfo);
      setUsername(userInfo.username || "User"); // Fallback to "User" if username is not present
    }
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear JWT token
    localStorage.removeItem("userInfo"); // Clear user information
    navigate("/login"); // Redirect to login page
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "red",
        color: "white",
        paddingLeft: "3rem",
        paddingRight: "3rem",
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={logoPtit}
            alt="logo"
            style={{ maxWidth: "40px", maxHeight: "40px" }}
          />
        </Box>

        {/* Navbar Links */}
        <Box
          sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-start" }}
        >
          <Button color="inherit" onClick={() => navigate("class")}>
            Lớp học
          </Button>
        </Box>

        {/* User Menu */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button color="inherit" onClick={handleMenuClick}>
            {username}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Thông tin tài khoản</MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default StudentHeader;
