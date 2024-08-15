import express from 'express';
import cors from 'cors';
import { loadCoinConfigs } from './src/config/coinConfigLoader';
import { getPrice } from './src/controllers/priceController';
import { errorHandler } from './src/utils/errorHandler';
import logger from './src/utils/logger';

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
