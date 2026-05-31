CREATE DATABASE IF NOT EXISTS SMS;
USE SMS;

CREATE TABLE IF NOT EXISTS Product (
  productCode VARCHAR(50) PRIMARY KEY,
  productName VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  quantityInStock INT NOT NULL DEFAULT 0,
  unitPrice DECIMAL(10, 2) NOT NULL,
  supplierName VARCHAR(100) NOT NULL,
  dateReceived DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS Warehouse (
  warehouseCode VARCHAR(50) PRIMARY KEY,
  warehouseName VARCHAR(100) NOT NULL,
  warehouseLocation VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS StockTransaction (
  transactionId INT AUTO_INCREMENT PRIMARY KEY,
  productCode VARCHAR(50) NOT NULL,
  warehouseCode VARCHAR(50) NOT NULL,
  transactionDate DATE NOT NULL,
  quantityMoved INT NOT NULL,
  transactionType ENUM('Stock In', 'Stock Out') NOT NULL,
  FOREIGN KEY (productCode) REFERENCES Product(productCode) ON DELETE CASCADE,
  FOREIGN KEY (warehouseCode) REFERENCES Warehouse(warehouseCode) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

INSERT INTO Users (username, password) VALUES ('admin', 'admin123');
