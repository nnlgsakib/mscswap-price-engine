import { ethers } from "ethers";
import { ERC20 } from "../constants/erc20";
import { RPC } from "../constants/config";  

export async function getERC20name(address: string): Promise<string> {
    const contract = new ethers.Contract(address, ERC20, RPC);
    try {
        const name = await contract.symbol();
        return name;
    } catch (error) {
        console.error('Error getting ERC20 name:', error);
        throw new Error(`Failed to get the ERC20 token name for address ${address}`);
    }
}
