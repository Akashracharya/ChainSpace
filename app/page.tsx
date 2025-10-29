"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import RightPanel from "../components/RightPanel";
import CodeModal from "../components/CodeModal";

export default function Page() {
  const [connected, setConnected] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("general");
  const [rooms, setRooms] = useState(["general", "dev-chat", "private-ideas"]);
  const [messages, setMessages] = useState([
    { id: 1, user: "alice.eth", text: "Welcome to the room!" },
    { id: 2, user: "bob.eth", text: "Share your snippet using the </> button." },
  ]);
  const [input, setInput] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState({ lang: "javascript", code: "" });

  const connectWallet = () => setConnected(true);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { id: Date.now(), user: "you.eth", text: input }]);
    setInput("");
  };

  const attachCode = () => {
    if (!codeSnippet.code.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: Date.now(),
        user: "you.eth",
        text: `\n\`\`\`${codeSnippet.lang}\n${codeSnippet.code}\n\`\`\``,
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
