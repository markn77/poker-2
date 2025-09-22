const pool = require('../config/database');

class User {
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT id, username, email, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    // Remove avatar_url from query since the column doesn't exist
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByIdWithStats(id) {
    // Simplified query without user_statistics table for now
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    // Return user with default stats
    return {
      ...result.rows[0],
      games_played: 0,
      hands_played: 0,
      hands_won: 0,
      total_winnings: 0,
      win_rate: 0,
      avg_pot_won: 0,
      last_played: null
    };
  }

  static async create({ username, email, passwordHash }) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create user
      const userResult = await client.query(
        'INSERT INTO users (username, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, username, email, created_at',
        [username, email, passwordHash]
      );
      
      const user = userResult.rows[0];
      
      await client.query('COMMIT');
      return user;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateProfile(id, { username, email, avatar_url }) {
    console.log('Updating profile for user ID:', id);
    console.log('Update data:', { username, email, avatar_url });
    
    try {
      // Don't try to update avatar_url since that column doesn't exist
      const result = await pool.query(
        'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email, created_at',
        [username, email, id]
      );
      
      console.log('Update query result:', result.rows[0]);
      
      if (result.rows.length === 0) {
        console.log('No rows updated - user not found');
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  }

  static async emailExists(email, excludeUserId = null) {
    let query = 'SELECT id FROM users WHERE email = $1';
    let params = [email];
    
    if (excludeUserId) {
      query += ' AND id != $2';
      params.push(excludeUserId);
    }
    
    const result = await pool.query(query, params);
    return result.rows.length > 0;
  }

  static async usernameExists(username, excludeUserId = null) {
    let query = 'SELECT id FROM users WHERE username = $1';
    let params = [username];
    
    if (excludeUserId) {
      query += ' AND id != $2';
      params.push(excludeUserId);
    }
    
    const result = await pool.query(query, params);
    return result.rows.length > 0;
  }

  static async getRecentGames(userId, limit = 10) {
    // Return empty array since game tables don't exist yet
    return [];
  }
}

module.exports = User;