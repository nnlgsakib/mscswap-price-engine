import fs from 'fs';
import path from 'path';
import { CoinConfig } from '../types/coinConfig';

export function loadCoinConfigs(): CoinConfig[] {
    const coinsPath = path.join(__dirname, "..", "..", "coins");
    const coinFiles = fs.readdirSync(coinsPath);
    return coinFiles.map(file => {
        const filePath = path.join(coinsPath, file);
        const coinConfig = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return {
            apiPath: coinConfig.api_path,
            pairAddress: coinConfig.pair_address
        };
    });
}
