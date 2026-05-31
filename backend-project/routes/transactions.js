const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  try {
    const { productCode, warehouseCode, transactionDate, quantityMoved, transactionType } = req.body;
    const [result] = await db.query(
      'INSERT INTO StockTransaction (productCode, warehouseCode, transactionDate, quantityMoved, transactionType) VALUES (?, ?, ?, ?, ?)',
      [productCode, warehouseCode, transactionDate, quantityMoved, transactionType]
    );
    const qty = parseInt(quantityMoved);
    if (transactionType === 'Stock In') {
      await db.query('UPDATE Product SET quantityInStock = quantityInStock + ? WHERE productCode = ?', [qty, productCode]);
    } else {
      await db.query('UPDATE Product SET quantityInStock = quantityInStock - ? WHERE productCode = ?', [qty, productCode]);
    }
    res.status(201).json({ success: true, message: 'Transaction added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT t.*, p.productName, w.warehouseName FROM StockTransaction t JOIN Product p ON t.productCode = p.productCode JOIN Warehouse w ON t.warehouseCode = w.warehouseCode ORDER BY t.transactionDate DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { productCode, warehouseCode, transactionDate, quantityMoved, transactionType } = req.body;

    const [oldRows] = await db.query('SELECT * FROM StockTransaction WHERE transactionId = ?', [id]);
    if (oldRows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    const old = oldRows[0];
    const oldQty = parseInt(old.quantityMoved);
    if (old.transactionType === 'Stock In') {
      await db.query('UPDATE Product SET quantityInStock = quantityInStock - ? WHERE productCode = ?', [oldQty, old.productCode]);
    } else {
      await db.query('UPDATE Product SET quantityInStock = quantityInStock + ? WHERE productCode = ?', [oldQty, old.productCode]);
    }

    const [result] = await db.query(
      'UPDATE StockTransaction SET productCode = ?, warehouseCode = ?, transactionDate = ?, quantityMoved = ?, transactionType = ? WHERE transactionId = ?',
      [productCode, warehouseCode, transactionDate, quantityMoved, transactionType, id]
    );

    const newQty = parseInt(quantityMoved);
    if (transactionType === 'Stock In') {
      await db.query('UPDATE Product SET quantityInStock = quantityInStock + ? WHERE productCode = ?', [newQty, productCode]);
    } else {
      await db.query('UPDATE Product SET quantityInStock = quantityInStock - ? WHERE productCode = ?', [newQty, productCode]);
    }

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Transaction updated successfully' });
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [oldRows] = await db.query('SELECT * FROM StockTransaction WHERE transactionId = ?', [id]);
    if (oldRows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    const old = oldRows[0];
    const oldQty = parseInt(old.quantityMoved);
    if (old.transactionType === 'Stock In') {
      await db.query('UPDATE Product SET quantityInStock = quantityInStock - ? WHERE productCode = ?', [oldQty, old.productCode]);
    } else {
      await db.query('UPDATE Product SET quantityInStock = quantityInStock + ? WHERE productCode = ?', [oldQty, old.productCode]);
    }

    const [result] = await db.query('DELETE FROM StockTransaction WHERE transactionId = ?', [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Transaction deleted successfully' });
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
