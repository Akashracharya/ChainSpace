"use client";

import { useState } from "react";
import { Wallet, Plus, Code, Send, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: number;
  username: string;
  timestamp: string;
  text?: string;
  code?: {
    language: string;
    content: string;
  };
};

type Room = {
  id: number;
  name: string;
};

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: "general" },
    { id: 2, name: "smart-contracts" },
    { id: 3, name: "frontend" },
  ]);
  const [activeRoom, setActiveRoom] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      username: "alice",
      timestamp: "10:32 AM",
      text: "Hey team, just deployed the latest contract to testnet",
    },
    {
      id: 2,
      username: "bob",
      timestamp: "10:35 AM",
      code: {
        language: "JavaScript",
        content: `const contract = await ethers.getContractFactory("MyContract");\nconst instance = await contract.deploy();\nawait instance.deployed();\nconsole.log("Contract deployed to:", instance.address);`,
      },
    },
    {
      id: 3,
      username: "carol",
      timestamp: "10:38 AM",
      text: "Looking good! Let me test the integration on my end",
    },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("JavaScript");
  const [codeContent, setCodeContent] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const members = ["alice", "bob", "carol", "dave"];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          username: "you",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: messageInput,
        },
      ]);
      setMessageInput("");
    }
  };

  const handleAttachCode = () => {
    if (codeContent.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          username: "you",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          code: {
            language: codeLanguage,
            content: codeContent,
          },
        },
      ]);
      setCodeContent("");
      setIsCodeModalOpen(false);
    }
  };

  const handleCopyCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddRoom = () => {
    const newRoomName = prompt("Enter room name:");
    if (newRoomName) {
      setRooms([...rooms, { id: rooms.length + 1, name: newRoomName }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[90vh] bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl glow-border overflow-hidden border border-slate-800/50">
        <div className="grid grid-cols-[240px_1fr_300px] h-full">
          <div className="bg-slate-900 border-r border-slate-800/50 flex flex-col">
            <div className="p-4 border-b border-slate-800/50">
              <h1 className="text-2xl font-bold font-mono bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                ChainSpace
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-mono">Secure Dev Chat</p>
            </div>

            <div className="p-3">
              <Button
                onClick={() => setIsWalletConnected(!isWalletConnected)}
                className={`w-full justify-start gap-2 transition-all ${
                  isWalletConnected
                    ? "bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30"
                    : "bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30"
                } border`}
                variant="outline"
              >
                <Wallet className="h-4 w-4" />
                {isWalletConnected ? "Connected" : "Connect Wallet"}
              </Button>
            </div>

            <ScrollArea className="flex-1 px-3 scrollbar-thin">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">Rooms</p>
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoom(room.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-mono ${
                      activeRoom === room.id
                        ? "bg-slate-800 text-blue-400 shadow-lg"
                        : "text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
                    }`}
                  >
                    # {room.name}
                  </button>
                ))}
              </div>
            </ScrollArea>

            <div className="p-3 border-t border-slate-800/50">
              <Button
                onClick={handleAddRoom}
                className="w-full justify-start gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Add Room
              </Button>
            </div>
          </div>

          <div className="bg-slate-850 flex flex-col">
            <div className="p-4 border-b border-slate-800/50">
              <h2 className="text-lg font-semibold text-slate-200 font-mono">
                # {rooms.find((r) => r.id === activeRoom)?.name}
              </h2>
            </div>

            <ScrollArea className="flex-1 p-4 scrollbar-thin">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="animate-fade-in">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 border border-slate-700">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-xs font-mono">
                          {msg.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-slate-200 text-sm">{msg.username}</span>
                          <span className="text-xs text-slate-500 font-mono">{msg.timestamp}</span>
                        </div>
                        {msg.text && <p className="text-slate-300 text-sm mt-1">{msg.text}</p>}
                        {msg.code && (
                          <div className="mt-2 rounded-lg overflow-hidden border border-slate-700/50 bg-slate-950/50">
                            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-700/50">
                              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                                {msg.code.language}
                              </span>
                              <button
                                onClick={() => handleCopyCode(msg.code!.content, msg.id)}
                                className="text-slate-400 hover:text-slate-200 transition-colors"
                              >
                                {copiedId === msg.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </button>
                            </div>
                            <pre className="p-3 text-sm font-mono text-slate-300 overflow-x-auto scrollbar-thin">
                              <code>{msg.code.content}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsCodeModalOpen(true)}
                  size="icon"
                  variant="outline"
                  className="shrink-0 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-blue-500/50 transition-all"
                >
                  <Code className="h-4 w-4" />
                </Button>
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-800 border-slate-700 focus:border-blue-500/50 text-slate-200 placeholder:text-slate-500"
                />
                <Button
                  onClick={handleSendMessage}
                  className="shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border-l border-slate-800/50 flex flex-col">
            <div className="flex-[3] border-b border-slate-800/50 p-4 flex flex-col">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-slate-200 font-mono">ChainSpace AI</h3>
                <p className="text-xs text-slate-500 mt-1">Ask about your project instantly</p>
              </div>
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask AI anything..."
                className="flex-1 bg-slate-800 border-slate-700 focus:border-green-500/50 text-slate-200 placeholder:text-slate-500 resize-none font-mono text-sm scrollbar-thin"
              />
              <Button className="mt-3 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all">
                Ask
              </Button>
            </div>

            <div className="flex-1 p-4">
              <h3 className="text-sm font-semibold text-slate-200 mb-3 font-mono">Members</h3>
              <div className="flex flex-wrap gap-2">
                {members.map((member) => (
                  <div
                    key={member}
                    className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700 transition-colors cursor-default"
                  >
                    {member}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isCodeModalOpen} onOpenChange={setIsCodeModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-200">
          <DialogHeader>
            <DialogTitle className="font-mono">Attach Code Snippet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Language</label>
              <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="TypeScript">TypeScript</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value="C++">C++</SelectItem>
                  <SelectItem value="Go">Go</SelectItem>
                  <SelectItem value="Rust">Rust</SelectItem>
                  <SelectItem value="HTML">HTML</SelectItem>
                  <SelectItem value="CSS">CSS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Code</label>
              <Textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                placeholder="Paste your code here..."
                className="min-h-[200px] bg-slate-800 border-slate-700 font-mono text-sm scrollbar-thin"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCodeModalOpen(false)} className="bg-slate-800 border-slate-700">
              Cancel
            </Button>
            <Button onClick={handleAttachCode} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              Attach Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
