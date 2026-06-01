const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const warehousesRouter = require('./routes/warehouses');
const transactionsRouter = require('./routes/transactions');
const reportsRouter = require('./routes/reports');
const { authenticate } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'SMS API is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/products', authenticate, productsRouter);
app.use('/api/warehouses', authenticate, warehousesRouter);
app.use('/api/transactions', authenticate, transactionsRouter);
app.use('/api/reports', authenticate, reportsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
