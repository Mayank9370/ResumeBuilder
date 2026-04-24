import jwt from 'jsonwebtoken';
import passport from '../../config/passport.config.js';

/**
 * Auth Controller
 * Handles authentication callbacks and token generation
 */

/**
 * Handle Google OAuth callback
 * Generates JWT token for authenticated user
 */
export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('[Google Callback] Authentication error:', err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    if (!user) {
      console.error('[Google Callback] No user returned');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`[Google Callback] Token generated for user: ${user.id}`);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    // Redirect to frontend with token (also in URL for flexibility)
    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${redirectUrl}/auth/success?token=${token}`);

  })(req, res, next);
};

/**
 * Logout user
 * Clears authentication token
 */
export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }

    // Fetch user from database
    const prisma = (await import('../../config/database.config.js')).default;
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      user 
    });

  } catch (error) {
    console.error('[Get Current User] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user details' 
    });
  }
};

/**
 * Verify token endpoint
 * Checks if the provided token is valid
 */
export const verifyToken = (req, res) => {
  // If middleware passed, token is valid
  res.json({ 
    success: true, 
    userId: req.userId,
    message: 'Token is valid' 
  });
};
