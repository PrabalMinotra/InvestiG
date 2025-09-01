const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Mock user database
const mockUsers = [
  {
    id: 'user_001',
    email: 'demo@investiguard.com',
    password: '$2b$10$mock.hash.for.demo', // In real app, this would be bcrypt hash
    name: 'Demo User',
    role: 'user',
    createdAt: new Date('2024-01-01').toISOString(),
    lastLogin: new Date().toISOString()
  }
];

// Mock JWT tokens (in real app, use proper JWT library)
const mockTokens = new Map();

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }
    
    // Find user (in real app, verify password hash)
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || password !== 'demo123') { // Mock password for demo
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }
    
    // Generate mock token
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    mockTokens.set(token, {
      userId: user.id,
      expiresAt: expiresAt.toISOString()
    });
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        expiresAt: expiresAt.toISOString()
      },
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

// POST /api/auth/register - User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Email, password, and name are required'
      });
    }
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }
    
    // Create new user (in real app, hash password)
    const newUser = {
      id: uuidv4(),
      email,
      password: '$2b$10$mock.hash.for.new.user',
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        }
      },
      message: 'Registration successful'
    });
    
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        error: 'Token is required'
      });
    }
    
    // Remove token (in real app, add to blacklist)
    mockTokens.delete(token);
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
    
  } catch (error) {
    console.error('Error in logout:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: error.message
    });
  }
});

// GET /api/auth/profile - Get user profile
router.get('/profile', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Authentication token required'
      });
    }
    
    const tokenData = mockTokens.get(token);
    if (!tokenData || new Date(tokenData.expiresAt) < new Date()) {
      return res.status(401).json({
        error: 'Invalid or expired token'
      });
    }
    
    const user = mockUsers.find(u => u.id === tokenData.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });
    
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: error.message
    });
  }
});

// POST /api/auth/refresh - Refresh authentication token
router.post('/refresh', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        error: 'Token is required'
      });
    }
    
    const tokenData = mockTokens.get(token);
    if (!tokenData) {
      return res.status(401).json({
        error: 'Invalid token'
      });
    }
    
    // Generate new token
    const newToken = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Remove old token and add new one
    mockTokens.delete(token);
    mockTokens.set(newToken, {
      userId: tokenData.userId,
      expiresAt: expiresAt.toISOString()
    });
    
    res.json({
      success: true,
      data: {
        token: newToken,
        expiresAt: expiresAt.toISOString()
      },
      message: 'Token refreshed successfully'
    });
    
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: error.message
    });
  }
});

module.exports = router;
