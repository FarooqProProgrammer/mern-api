import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { engine } from 'express-handlebars';
import authRoutes from './routes/auth.js'; // Import auth routes
import chalk from 'chalk'; // Import Chalk for logging

const app = express();

// Middleware for body parsing
app.use(bodyParser.json());
app.use(express.static('public'));

// Session middleware
app.use(session({
  secret: 'your-secret-key', 
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/your-database', 
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, 
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
    console.log(chalk.green('MongoDB connected successfully'));
  } catch (err) {
    console.error(chalk.red('MongoDB connection error:', err));
    process.exit(1); // Exit if connection fails
  }
};

// Use the authentication routes
app.use('/api/auth', authRoutes);

// Start the server
const startServer = async () => {
  await connectDB();
  app.listen(3000, () => {
    console.log(chalk.blue('Server is running on http://localhost:3000'));
  });
};

startServer();
