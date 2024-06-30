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
});

// Passport middleware
app.use(passport.initialize());
// Import and configure Passport (assuming you're using JWT strategy)
require('./config/passport')(passport);

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const userDetailsRouter = require('./routes/userDetailsRouter');

const questionRoutes = require('./routes/questionRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const requestRoutes = require('./routes/requestRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const statusRoutes = require('./routes/statusRoutes');
const skillRoutes = require('./routes/skillRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/detail', userDetailsRouter);
app.use('/api', chatRoutes); 

app.use('/api/questions', questionRoutes);
app.use('/api', experienceRoutes);
app.use('/api', skillRoutes);
app.use('/api', resourceRoutes);
app.use('/api', requestRoutes);
app.use('/api/status', statusRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});


