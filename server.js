const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const config = require('./config/config');
require('dotenv').config();
const path = require('path'); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully');
console.log(`Using MongoDB URI: ${config.database}`);
});

// Passport middleware
app.use(passport.initialize());
// Import and configure Passport (assuming you're using JWT strategy)
require('./config/passport')(passport);

const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const caseRoutes = require('./routes/caseRoutes');

app.use('/api/cases', caseRoutes);

app.use('/api/auth', authRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', messageRoutes);
const { insertAdminUser } = require('./controllers/authController');

// Call insertAdminUser to insert the admin user when the server starts
insertAdminUser();



app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});


