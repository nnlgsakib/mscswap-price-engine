import express from 'express';
import cors from 'cors';
import { loadCoinConfigs } from './config/coinConfigLoader';
import { getPrice } from './controllers/priceController';
import { errorHandler } from './utils/errorHandler';
import logger from './utils/logger';

const app = express();
const port = 3000;

app.use(cors());

// Load coin configs and create routes
const coinConfigs = loadCoinConfigs();
coinConfigs.forEach(({ apiPath, pairAddress }) => {
    app.get(apiPath, (req, res, next) => {
        req.params.pairAddress = pairAddress;
        getPrice(req, res, next);
    });
});

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});
