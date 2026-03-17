const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const config = require('./config');
const routes = require('./routes');
const { errorHandler, requestLogger } = require('./middlewares');
const { API_PREFIX } = require('./constants/routes');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: ['http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

// Serve uploaded product images (frontend: <img src="{API_ORIGIN}/uploads/products/..." />)
app.use('/uploads', express.static(path.join(process.cwd(), config.upload.dir)));

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: { message: 'Not found' } });
});

app.use(errorHandler);

module.exports = app;
