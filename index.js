import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { engine } from 'express-handlebars';
import authRoutes from './routes/auth.js'; // Import auth routes

const app = express();

// Middleware for body parsing
app.use(bodyParser.json());
app.use(express.static('public'))

// Session middleware
app.use(session({
  secret: 'your-secret-key', // Use a secure, unique key in production
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/your-database', // MongoDB connection URL
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// Set up Handlebars view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views'); // Set the directory for views

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/your-database', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if connection fails
  }
};

// Use the authentication routes
app.use('/api/auth', authRoutes);


// Start the server
const startServer = async () => {
  await connectDB();
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
};

startServer();
