const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allows frontend to communicate with backend
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// MongoDB connection
mongoose
.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection failed:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('API is running');
});
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});