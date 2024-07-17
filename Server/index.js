const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS options
const corsOptions = {
  origin: '*', // Allow all origins
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import and use routers
const authRouter = require('./routes/auth');
const generateRouter = require('./routes/generate');

app.use('/auth', authRouter);
app.use('/', generateRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
