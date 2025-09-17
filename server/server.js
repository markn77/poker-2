const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Enable CORS for your React frontend
app.use(cors({
    origin: 'http://localhost:3000', // React app origin
    credentials: true
}));

app.use(bodyParser.json());

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND password = $2',
            [email, password] // TODO: hash passwords and compare hashes in production
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.json({ 
                success: true, 
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    created_at: user.created_at
                }
            });
        } else {
            res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Sign-up route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, password] // TODO: hash passwords in production
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique constraint violation
            res.status(400).json({ 
                success: false, 
                error: 'Username or email already exists' 
            });
        } else {
            res.status(500).json({ success: false, error: err.message });
        }
    }
});

// Start server
app.listen(3001, () => console.log('Server running on port 3001'));