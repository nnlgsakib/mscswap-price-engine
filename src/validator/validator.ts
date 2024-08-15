import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';

// Define the schema for the coin JSON files with Ethereum address validation
const coinSchema = {
    type: 'object',
    properties: {
        api_path: { type: 'string' },
        pair_address: {
            type: 'string',
            pattern: '^0x[a-fA-F0-9]{40}$' // Ethereum address pattern
        }
    },
    required: ['api_path', 'pair_address'],
    additionalProperties: false
};

// Initialize Ajv
const ajv = new Ajv();
const validate = ajv.compile(coinSchema);

// Function to validate JSON files in the coins directory
export function validateCoins(): boolean {
    const coinsPath = path.join(__dirname, '..', '..', 'coins');
    const files = fs.readdirSync(coinsPath);
    let allValid = true;

    files.forEach(file => {
        const filePath = path.join(coinsPath, file);
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            if (!validate(data)) {
                console.error(`Validation errors in ${file}:`, validate.errors);
                allValid = false;
            } else {
                console.log(`${file} is valid.`);
            }
        } catch (err) {
            console.error(`Error reading or parsing ${file}:`, err);
            allValid = false;
        }
    });

    return allValid;
}
