import { ethers } from "ethers";
import abi from "../blockchain/artifacts/contracts/RoomFactory.sol/RoomFactory.json";

// .env.local
// CHAINSPACE_RPC_URL=http://127.0.0.1:8545
// CHAINSPACE_CONTRACT=0xYourNewDeployedAddress

const RPC_URL = process.env.CHAINSPACE_RPC_URL || "http://127.0.0.1:8545";
const CONTRACT = process.env.CHAINSPACE_CONTRACT as string;

if (!CONTRACT) {
  console.warn("[server-chain] Missing CHAINSPACE_CONTRACT in environment.");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

export function getServerContract() {
  if (!CONTRACT) throw new Error("CHAINSPACE_CONTRACT not set");
  return new ethers.Contract(CONTRACT, (abi as any).abi, provider);
}
