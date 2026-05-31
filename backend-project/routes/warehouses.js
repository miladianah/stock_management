const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  try {
    const { warehouseCode, warehouseName, warehouseLocation } = req.body;
    const [result] = await db.query(
      'INSERT INTO Warehouse (warehouseCode, warehouseName, warehouseLocation) VALUES (?, ?, ?)',
      [warehouseCode, warehouseName, warehouseLocation]
    );
    res.status(201).json({ success: true, message: 'Warehouse added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Warehouse');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
