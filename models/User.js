import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';  // For password hashing

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,  // Optional: ensures email is stored in lowercase
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],  // Optional: email format validation
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],  // You can define other roles here
    default: 'admin',  // Default role is 'admin'
  },
});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if entered password matches the hashed password in the DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the user model
const User = mongoose.model('User', userSchema);

export default User;
