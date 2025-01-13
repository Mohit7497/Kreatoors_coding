import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token
    alert("Logged out successfully");
    navigate("/login"); // Redirect to login page
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        Welcome to the Dashboard
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}

export default Dashboard;