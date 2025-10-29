"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import RightPanel from "../components/RightPanel";
import CodeModal from "../components/CodeModal";

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("general");
  const [rooms, setRooms] = useState(["general", "dev-chat", "private-ideas"]);
  const [messages, setMessages] = useState([
    { id: 1, user: "alice.eth", text: "Welcome to the room!" },
    { id: 2, user: "bob.eth", text: "Share your snippet using the </> button." },
  ]);
  const [input, setInput] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState({ lang: "javascript", code: "" });

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
        connected={connected}
        connectWallet={connectWallet}
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
        connected={connected}
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
