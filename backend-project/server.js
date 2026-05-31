const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const productsRouter = require('./routes/products');
const warehousesRouter = require('./routes/warehouses');
const transactionsRouter = require('./routes/transactions');
const reportsRouter = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/warehouses', warehousesRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/reports', reportsRouter);

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }
    const [existing] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Username already exists' });
    }
    await db.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, password]);
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.query(
      'SELECT * FROM Users WHERE username = ? AND password = ?',
      [username, password]
    );
    if (rows.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
