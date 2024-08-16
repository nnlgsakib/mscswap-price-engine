import { ethers } from "ethers";
import {mainnet_rpc} from "msc-js"
export const LEVELDB_PATH = './prices';
export const RPC = new ethers.JsonRpcProvider(mainnet_rpc.http);