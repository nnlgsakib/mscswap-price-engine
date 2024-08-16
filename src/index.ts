import express from 'express';
import cors from 'cors';
import { loadCoinConfigs } from './config/coinConfigLoader';
import { getReserve } from './services/priceService';
import { errorHandler } from './utils/errorHandler';
import logger from './utils/logger';
import { validateCoins } from './validator/validator'; 
import { startBlockListener } from './services/blocklistener';  // Import the block listener

const app = express();
const port = process.env.PORT || 3000;

const initializeServer = () => {
    logger.info('Initializing server...');

    // Apply CORS middleware
    logger.debug('Applying CORS middleware.');
    app.use(cors());

    // Load and configure coin routes
    logger.info('Loading coin configurations.');
    const coinConfigs = loadCoinConfigs();
    logger.info(`Loaded ${coinConfigs.length} coin configurations.`);

    coinConfigs.forEach(({ apiPath, pairAddress }) => {
        logger.info(`Setting up route for ${apiPath} with pair address ${pairAddress}.`);
        app.get(apiPath, async (req, res, next) => {
            try {
                logger.debug(`Received request on ${apiPath} with query: ${JSON.stringify(req.query)}`);
                const price = await getReserve(pairAddress);
                logger.debug(`Successfully fetched price for ${pairAddress}: ${price}`);
                res.json({ price });
            } catch (error:any) {
                logger.error(`Error fetching price for ${apiPath}: ${error.message}`);
                next(error);
            }
        });
    });

    // Apply error handling middleware
    logger.debug('Applying error handling middleware.');
    app.use(errorHandler);

    // Start the block listener to update prices on new blocks
    logger.info('Starting block listener.');
    startBlockListener();

    // Start the server
    app.listen(port, () => logger.info(`Server is running at http://localhost:${port}`));
};

// Validate JSON files and start the server if validation passes
logger.info('Validating coin JSON files...');
if (validateCoins()) {
    logger.info('JSON validation passed. Starting server.');
    initializeServer();
} else {
    logger.error('JSON validation failed. Aborting startup.');
    process.exit(1); // Exit with failure code
}
