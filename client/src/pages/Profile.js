import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Avatar, Grid } from "@mui/material";

function Profile() {
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5001/profile", {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setName(data.name || "");
        setPreview(`http://localhost:5001/${data.profileImage}` || ""); // Preview existing profile image
      });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (file) formData.append("profileImage", file);

    const token = localStorage.getItem("token");
    await fetch("http://localhost:5001/profile", {
      method: "PUT",
      headers: { Authorization: token },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Profile updated");
        setProfile(data.user || {});
        if (data.user.profileImage) {
          setPreview(`http://localhost:5001/${data.user.profileImage}`); // Update image preview
        }
      });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Update image preview
    const filePreview = URL.createObjectURL(selectedFile);
    setPreview(filePreview);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "50px auto",
        padding: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        Profile
      </Typography>
      <Grid container spacing={3}>
        {/* Profile Image Section */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
            <Avatar
              src={preview}
              alt="Profile"
              sx={{ width: 100, height: 100, border: "2px solid #ccc" }}
            />
          </Box>
          <Typography variant="body2" sx={{ textAlign: "center", color: "#555" }}>
            Change Profile Image
          </Typography>
          <input
            type="file"
            accept="image/*"
            style={{ marginTop: 10 }}
            onChange={handleFileChange}
          />
        </Grid>

        {/* Profile Form Section */}
        <Grid item xs={12} md={8}>
          <form onSubmit={handleUpdate}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              sx={{ mb: 3 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button variant="contained" type="submit" fullWidth>
              Update Profile
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;