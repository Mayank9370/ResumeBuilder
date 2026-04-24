import express from 'express';
import passport from '../../config/passport.config.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { 
  googleCallback, 
  logout, 
  getCurrentUser, 
  verifyToken 
} from './auth.controller.js';

const router = express.Router();

/**
 * Authentication Routes
 * Handles Google OAuth flow and user session management
 */

// Google OAuth - Initiate authentication
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

// Google OAuth - Callback
router.get('/google/callback', googleCallback);

// Logout
router.post('/logout', logout);

// Get current user (protected)
router.get('/me', authenticate, getCurrentUser);

// Verify token (protected)
router.get('/verify', authenticate, verifyToken);

export default router;
