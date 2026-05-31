const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  try {
    const { productCode, productName, category, quantityInStock, unitPrice, supplierName, dateReceived } = req.body;
    const [result] = await db.query(
      'INSERT INTO Product (productCode, productName, category, quantityInStock, unitPrice, supplierName, dateReceived) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [productCode, productName, category, quantityInStock, unitPrice, supplierName, dateReceived]
    );
    res.status(201).json({ success: true, message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Product');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
