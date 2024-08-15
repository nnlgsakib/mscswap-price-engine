import { ethers } from 'ethers';
import { ABI } from './../constants/abi';
import { CustomError } from '../types/customError';
import { RPC } from '../constants/config';
import { getERC20name } from './namefetcher';

const provider = RPC;

export async function getReserve(pairAddress: string): Promise<string> {
    const contract = new ethers.Contract(pairAddress, ABI, provider);
    try {
        const token0 = await contract.token0();
        const token1 = await contract.token1();
        const reserves = await contract.getReserves();
        
        const reserve0 = ethers.formatEther(reserves._reserve0);
        const reserve1 = ethers.formatEther(reserves._reserve1);
        
        const in_usd = parseFloat(reserve0) / parseFloat(reserve1);
        
        // Fetch the names of the tokens asynchronously
        const token0Name = await getERC20name(token0);
        const token1Name = await getERC20name(token1);
        
        return `1 ${token1Name} = ${in_usd.toFixed(5)} ${token0Name}`;
    } catch (error) {
        throw new CustomError("Failed to fetch reserves", 500);
    }
}
