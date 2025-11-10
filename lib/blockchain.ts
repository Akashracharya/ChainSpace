// ---- ADD THIS BLOCK ----
declare global {
  interface Window {
    ethereum?: any;
  }
}
// -------------------------

import { ethers } from "ethers";
import abi from "../blockchain/artifacts/contracts/RoomFactory.sol/RoomFactory.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export async function getContract() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not available.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  const signer = await provider.getSigner(); // ✅ await here

  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
}
