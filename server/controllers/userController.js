const User = require('../models/User');

class UserController {
  static async getProfile(req, res) {
    console.log('=== UserController.getProfile called ===');
    console.log('req.user:', req.user);
    console.log('req.user type:', typeof req.user);
    
    if (!req.user) {
      console.error('ERROR: req.user is undefined - auth middleware not working');
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }
    
    console.log('req.user.userId:', req.user.userId);
    
    try {
      // First, try a simple findById to test
      console.log('Attempting to find user by ID:', req.user.userId);
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        console.log('User not found in database');
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      console.log('User found:', user);
      
      // For now, return simple user data without stats to test basic functionality
      res.json({
        success: true,
        user: {
          ...user,
          // Add default stats for now
          games_played: 0,
          hands_played: 0,
          hands_won: 0,
          total_winnings: 0,
          win_rate: 0,
          avg_pot_won: 0,
          last_played: null
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async updateProfile(req, res) {
    console.log('=== UserController.updateProfile called ===');
    console.log('req.user:', req.user);
    console.log('req.body:', req.body);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }
    
    try {
      const { username, email, avatar_url } = req.body;
      const userId = req.user.userId;

      // Check if email is being changed and already exists
      if (email && email !== req.user.email) {
        const emailExists = await User.emailExists(email, userId);
        if (emailExists) {
          return res.status(400).json({
            success: false,
            error: 'Email already exists'
          });
        }
      }

      // Check if username is being changed and already exists  
      if (username && username !== req.user.username) {
        const usernameExists = await User.usernameExists(username, userId);
        if (usernameExists) {
          return res.status(400).json({
            success: false,
            error: 'Username already exists'
          });
        }
      }

      // Update the profile
      console.log('Updating profile for user:', userId);
      const updatedUser = await User.updateProfile(userId, {
        username: username || req.user.username,
        email: email || req.user.email,
        avatar_url
      });

      console.log('Profile updated successfully:', updatedUser);

      res.json({
        success: true,
        user: {
          ...updatedUser,
          // Add default stats for now
          games_played: 0,
          hands_played: 0,
          hands_won: 0,
          total_winnings: 0,
          win_rate: 0,
          avg_pot_won: 0,
          last_played: null
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  static async getRecentGames(req, res) {
    console.log('=== UserController.getRecentGames called ===');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }
    
    try {
      const userId = req.user.userId;
      const limit = parseInt(req.query.limit) || 10;

      // For now, return empty array since game tables might not exist yet
      res.json({
        success: true,
        games: []
      });
    } catch (error) {
      console.error('Get recent games error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

module.exports = UserController;