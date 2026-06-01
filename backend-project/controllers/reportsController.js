const db = require('../db');

exports.daily = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.transactionDate,
        p.productCode,
        p.productName,
        p.category,
        w.warehouseName,
        CASE WHEN t.transactionType = 'Stock In' THEN t.quantityMoved ELSE 0 END AS stockIn,
        CASE WHEN t.transactionType = 'Stock Out' THEN t.quantityMoved ELSE 0 END AS stockOut,
        t.quantityMoved,
        t.transactionType,
        p.quantityInStock - CASE WHEN t.transactionType = 'Stock In' THEN t.quantityMoved ELSE -t.quantityMoved END AS currentStock,
        p.quantityInStock AS newStock
      FROM StockTransaction t
      JOIN Product p ON t.productCode = p.productCode
      JOIN Warehouse w ON t.warehouseCode = w.warehouseCode
      WHERE t.transactionDate = CURDATE()
      ORDER BY t.transactionDate DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.weekly = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        YEARWEEK(t.transactionDate) AS week,
        MIN(t.transactionDate) AS weekStart,
        MAX(t.transactionDate) AS weekEnd,
        p.productCode,
        p.productName,
        p.category,
        w.warehouseName,
        SUM(CASE WHEN t.transactionType = 'Stock In' THEN t.quantityMoved ELSE 0 END) AS totalStockIn,
        SUM(CASE WHEN t.transactionType = 'Stock Out' THEN t.quantityMoved ELSE 0 END) AS totalStockOut,
        p.quantityInStock,
        p.unitPrice
      FROM StockTransaction t
      JOIN Product p ON t.productCode = p.productCode
      JOIN Warehouse w ON t.warehouseCode = w.warehouseCode
      WHERE YEARWEEK(t.transactionDate) = YEARWEEK(CURDATE())
      GROUP BY YEARWEEK(t.transactionDate), p.productCode, p.productName, p.category, w.warehouseName, p.quantityInStock, p.unitPrice
      ORDER BY weekStart DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.monthly = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(t.transactionDate, '%Y-%m') AS month,
        p.productCode,
        p.productName,
        p.category,
        w.warehouseName,
        SUM(CASE WHEN t.transactionType = 'Stock In' THEN t.quantityMoved ELSE 0 END) AS totalStockIn,
        SUM(CASE WHEN t.transactionType = 'Stock Out' THEN t.quantityMoved ELSE 0 END) AS totalStockOut,
        p.quantityInStock,
        p.unitPrice
      FROM StockTransaction t
      JOIN Product p ON t.productCode = p.productCode
      JOIN Warehouse w ON t.warehouseCode = w.warehouseCode
      WHERE DATE_FORMAT(t.transactionDate, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
      GROUP BY DATE_FORMAT(t.transactionDate, '%Y-%m'), p.productCode, p.productName, p.category, w.warehouseName, p.quantityInStock, p.unitPrice
      ORDER BY month DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.stockAvailability = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.productCode,
        p.productName,
        p.category,
        p.quantityInStock,
        p.unitPrice,
        (p.quantityInStock * p.unitPrice) AS totalValue,
        p.supplierName,
        p.dateReceived
      FROM Product p
      ORDER BY p.quantityInStock ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const [productCount] = await db.query('SELECT COUNT(*) AS count FROM Product');
    const [warehouseCount] = await db.query('SELECT COUNT(*) AS count FROM Warehouse');
    const [transactionCount] = await db.query('SELECT COUNT(*) AS count FROM StockTransaction');
    const [totalValue] = await db.query('SELECT COALESCE(SUM(quantityInStock * unitPrice), 0) AS total FROM Product');
    const [lowStock] = await db.query('SELECT * FROM Product WHERE quantityInStock < 10 ORDER BY quantityInStock ASC LIMIT 5');
    const [recentTransactions] = await db.query(
      `SELECT t.*, p.productName, w.warehouseName 
       FROM StockTransaction t 
       JOIN Product p ON t.productCode = p.productCode 
       JOIN Warehouse w ON t.warehouseCode = w.warehouseCode 
       ORDER BY t.transactionDate DESC LIMIT 10`
    );
    const [stockInTotal] = await db.query(
      "SELECT COALESCE(SUM(quantityMoved), 0) AS total FROM StockTransaction WHERE transactionType = 'Stock In'"
    );
    const [stockOutTotal] = await db.query(
      "SELECT COALESCE(SUM(quantityMoved), 0) AS total FROM StockTransaction WHERE transactionType = 'Stock Out'"
    );

    res.json({
      totalProducts: productCount[0].count,
      totalWarehouses: warehouseCount[0].count,
      totalTransactions: transactionCount[0].count,
      totalStockValue: totalValue[0].total,
      totalStockIn: stockInTotal[0].total,
      totalStockOut: stockOutTotal[0].total,
      lowStockProducts: lowStock,
      recentTransactions: recentTransactions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
