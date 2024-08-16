import { ethers } from 'ethers';
import level from 'level';
import {  RPC, LEVELDB_PATH } from './../constants/config';
import { ABI } from './../constants/abi';
import { getERC20name } from './namefetcher'; 

export const db = level(LEVELDB_PATH, { valueEncoding: 'json' });

export async function getReserve(pairAddress: string): Promise<string> {
    try {
        const cachedPrice = await db.get(pairAddress).catch(() => null);

        if (cachedPrice) {
            return cachedPrice;
        }

        const contract = new ethers.Contract(pairAddress, ABI, RPC);
        const [token0, token1, reserves] = await Promise.all([
            contract.token0(),
            contract.token1(),
            contract.getReserves(),
        ]);

        const reserve0 = ethers.formatEther(reserves._reserve0);
        const reserve1 = ethers.formatEther(reserves._reserve1);
        const inUsd = parseFloat(reserve0) / parseFloat(reserve1);

        const [token0Name, token1Name] = await Promise.all([
            getERC20name(token0),
            getERC20name(token1),
        ]);

        const price = `1 ${token1Name} = ${inUsd.toFixed(5)} ${token0Name}`;

        await db.put(pairAddress, price);

        return price;
    } catch (error) {
        throw new Error("Failed to fetch reserves");
    }
}
