import { ethers } from "ethers";
import {mainnet_rpc} from "msc-js"
export const RPC = new ethers.JsonRpcProvider(mainnet_rpc.http);