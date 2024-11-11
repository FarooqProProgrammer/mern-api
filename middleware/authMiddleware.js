import jwt from 'jsonwebtoken';

export const checkAuthenticated = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.user = decoded; // Store the decoded token data (user information) in the request object
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export const checkNotAuthenticated = (req, res, next) => {
  if (req.user) {
    return res.redirect('/dashboard');
  }
  next();
};
