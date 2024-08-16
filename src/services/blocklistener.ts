import { RPC } from './../constants/config';
import { loadCoinConfigs } from '../config/coinConfigLoader';
import { getReserve } from './priceService';
import { db } from './priceService';
import logger from '../utils/logger';

export function startBlockListener() {
    RPC.on('block', async (blockNumber: number) => {
        logger.info(`New block detected: ${blockNumber}`);

        const coinConfigs = loadCoinConfigs();

        const fetchPromises = coinConfigs.map(async ({ pairAddress }) => {
            await db.del(pairAddress);  // Remove old data
            return getReserve(pairAddress).catch(error => {
                logger.error(`Error fetching price for ${pairAddress}:`, error);
                return null;
            });
        });

        await Promise.all(fetchPromises);
    });
}
