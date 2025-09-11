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
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start server
app.listen(3001, () => console.log('Server running on port 3001'));
