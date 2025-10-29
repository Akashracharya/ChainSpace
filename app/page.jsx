"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import RightPanel from "../components/RightPanel";
import CodeModal from "../components/CodeModal";
import { ethers } from "ethers"; // <-- IMPORT ETHERS
import { SiweMessage } from "siwe"; // <-- IMPORT SIWE
// No need to import ethers here for this basic connection

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState(""); // <-- ADD THIS STATE
  const [selectedRoom, setSelectedRoom] = useState("general");
  const [rooms, setRooms] = useState(["general", "dev-chat", "private-ideas"]);
  // ...other states
  const [messages, setMessages] = useState([
    { id: 1, user: "alice.eth", text: "Welcome to the room!", type: "text" },
    { id: 2, user: "bob.eth", text: "Share your snippet using the </> button.", type: "text" },
  ]);
  const [input, setInput] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState({ lang: "javascript", code: "" });
  // FROM:
  // const connectWallet = () => setConnected(true);

  // TO: (Replace with this async function)
  const connectWallet = async () => {
    try {
      // Check if MetaMask (or other browser wallet) is installed
      if (!window.ethereum) {
        alert("Please install MetaMask to use this app.");
        return;
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]); // Store the user's address
        setConnected(true);     // Set connected state
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };
const signIn = async () => {
    console.log("--- signIn started ---");

    try {
      // 1. Check for wallet
      if (!window.ethereum) {
        alert("Please install MetaMask to use this app.");
        return;
      }
      console.log("1. window.ethereum found.");

      // 2. Create provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log("2. Ethers provider created.");

      // 3. Get signer (This should trigger the connect pop-up)
      console.log("3. Requesting signer (this should open MetaMask)...");
      const signer = await provider.getSigner();
      console.log("4. Signer acquired!");

      // 5. Get address & network
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      console.log(`5. Address: ${address}, Network: ${network.chainId}`);

      // 6. Create the SIWE message
      const domain = window.location.host;
      const origin = window.location.origin;
      const statement = "Sign in to ChainSpace to prove wallet ownership.";
      
      const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: "1",
        chainId: Number(network.chainId),
      });

      // 7. Ask user to sign the message
      console.log("6. Preparing SIWE message...");
      const preparedMessage = message.prepareMessage();
      console.log("7. Popping up MetaMask for signature...");
      const signature = await signer.signMessage(preparedMessage);
      console.log("8. Signature received!");

      // 8. Send signature to our backend API
      console.log("9. Verifying signature with backend...");
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: preparedMessage, signature }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        // 9. User is authenticated!
        console.log("10. Verification SUCCESS! User is authenticated.");
        setAccount(data.address);
        setIsAuthenticated(true);
      } else {
        throw new Error(data.error || "Verification failed via API.");
      }

    } catch (error) {
      console.error("--- signIn FAILED ---", error);
      alert(`Sign-in failed: ${error.message}`);
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((m) => [
      ...m, 
      { 
        id: Date.now(), 
        // Use the real address if available, otherwise "you.eth"
        user: account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "you.eth", 
        type: "text", 
        text: input 
      }
    ]);
    setInput("");
  };

  const attachCode = () => {
    if (!codeSnippet.code.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: Date.now(),
        // Use the real address if available
        user: account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "you.eth",
        type: "code",
        lang: codeSnippet.lang,
        text: codeSnippet.code,
      },
    ]);
    setShowCodeModal(false);
    setCodeSnippet({ lang: "javascript", code: "" });
  };

  return (
    <div className="w-full max-w-7xl h-[90vh] flex rounded-2xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-2xl shadow-2xl">
      <Sidebar
        connected={isAuthenticated} // Pass isAuthenticated
        connectWallet={signIn}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        rooms={rooms}
        account={account} // <-- PASS THE ACCOUNT PROP
      />

      <ChatArea
        selectedRoom={selectedRoom}
        messages={messages}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        connected={isAuthenticated}        
        setShowCodeModal={setShowCodeModal}
      />
      
      <RightPanel />

      {showCodeModal && (
        <CodeModal
          codeSnippet={codeSnippet}
          setCodeSnippet={setCodeSnippet}
          attachCode={attachCode}
          setShowCodeModal={setShowCodeModal}
        />
      )}
    </div>
  );
}