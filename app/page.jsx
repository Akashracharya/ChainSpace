"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import RightPanel from "../components/RightPanel";
import CodeModal from "../components/CodeModal";
import NewRoomModal from "../components/NewRoomModal";
import InviteModal from "../components/InviteModal";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";
import { getContract } from "../lib/blockchain";
import { supabase } from "../lib/supabase";

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [account, setAccount] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("general");

  const [rooms, setRooms] = useState([
    { id: "general", name: "General", owner: "system", members: ["everyone"], createdAt: Date.now() }
  ]);

  // ✅ Load rooms from Supabase (after wallet login)
useEffect(() => {
  if (!isAuthenticated) return;

  const loadRooms = async () => {
    const res = await fetch(`/api/rooms?address=${account}`);
    const { rooms } = await res.json();

    // Replace existing rooms with rooms from DB
    setRooms(prev => {
  const merged = [...prev, ...rooms];

  const unique = merged.reduce((acc, room) => {
    acc[room.id] = room;  // overwrites duplicates
    return acc;
  }, {});

  return Object.values(unique);
});


  };

  loadRooms();
}, [isAuthenticated]);


  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState({ lang: "javascript", code: "" });

  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Load messages when room changes
  useEffect(() => {
  if (!selectedRoom) return;

  const load = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", selectedRoom)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  };

  load();
}, [selectedRoom]);

// Real-time subscription → updates message list when new message is inserted
useEffect(() => {
  if (!selectedRoom) return;

  const channel = supabase
    .channel(`messages-${selectedRoom}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `room_id=eq.${selectedRoom}`,
      },
      (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [selectedRoom]);


// ✅ Realtime subscription: whenever a new room is inserted into Supabase
useEffect(() => {
  const channel = supabase
    .channel("rooms-realtime")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "rooms",
      },
      (payload) => {
        console.log("📢 NEW ROOM CREATED:", payload.new);
        setRooms((prev) => [...prev, payload.new]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);



  // ✅ Correct SIWE Login
  const signIn = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      // Auto add + switch to Hardhat local chain (31337)
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x7A69" }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x7A69",
                chainName: "Hardhat Localhost",
                rpcUrls: ["http://127.0.0.1:8545/"],
                nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
              },
            ],
          });
        }
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to ChainSpace.",
        uri: window.location.origin,
        version: "1",
        chainId: Number(network.chainId),
        nonce: Math.random().toString(36).slice(2),
      });

      const prepared = message.prepareMessage();
      const signature = await signer.signMessage(prepared);

      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
      });

      const data = await res.json();

      if (!data.ok) throw new Error(data.error || "Verification failed");

      setAccount(data.address);
      setIsAuthenticated(true);

    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  // ✅ Create room: Blockchain + API store
  const createRoom = async (roomName) => {
    if (!roomName || !account) {
      console.warn("Room name or wallet missing.");
      return;
    }
// ✅ Room ID = slug (ONLY name, no timestamp)
const roomId = roomName.toLowerCase().replace(/\s+/g, "-");

// ✅ Prevent duplicate room creation
if (rooms.some(r => r.id === roomId)) {
  alert("Room already exists!");
  return;
}

    const contract = await getContract();
    const tx = await contract.createRoom(roomId, roomName);
    await tx.wait();

    await fetch(`/api/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: roomId, name: roomName, owner: account }),
    });

    setRooms(prev => [...prev, {
      id: roomId, name: roomName, owner: account, members: [account], createdAt: Date.now(),
    }]);

    alert("✅ Room created on blockchain!");
  };

  // ✅ Invite user to private room
  const inviteToRoom = async (walletAddress) => {
    const contract = await getContract();
    const tx = await contract.addMember(selectedRoom, walletAddress);
    await tx.wait();

    await fetch(`/api/rooms/${selectedRoom}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: walletAddress }),
    });

    alert(`✅ Member invited: ${walletAddress}`);
  };

  // ✅ Send chat message
  const sendMessage = async () => {
  if (!input.trim() || !account) return;

  console.log("💬 trying message:", input);

  const res = await fetch(`/api/rooms/${selectedRoom}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: account,
      text: input.trim(),
    }),
  });

  if (res.status === 403) {
    alert("🚫 You are not a member of this room (on-chain access denied)");
    return;
  }

  const data = await res.json();

  if (!data.message) return;

  setInput("");
};

const currentRoom =
  rooms.find(r => r.id === selectedRoom) ||
  { id: "general", name: "General", owner: "system", members: ["everyone"] };

  return (
    <div className="w-full max-w-7xl h-[90vh] flex rounded-2xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-2xl shadow-2xl">

      <Sidebar
        connected={isAuthenticated}
        connectWallet={signIn}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        rooms={rooms}
        account={account}
      />

      <ChatArea
        room={currentRoom}
        selectedRoom={selectedRoom}
        messages={messages}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        connected={isAuthenticated}
        setShowCodeModal={setShowCodeModal}
        setShowNewRoomModal={setShowNewRoomModal}
        setShowInviteModal={setShowInviteModal}
        isOwner={
          currentRoom?.owner &&
          account &&
          currentRoom.owner.toLowerCase() === account.toLowerCase()
        }
      />

      <RightPanel />

      {showCodeModal && (
        <CodeModal
          codeSnippet={codeSnippet}
          setCodeSnippet={setCodeSnippet}
          setShowCodeModal={setShowCodeModal}
        />
      )}

      {showNewRoomModal && (
        <NewRoomModal
          setShowNewRoomModal={setShowNewRoomModal}
          createRoom={createRoom}
        />
      )}

      {showInviteModal && (
        <InviteModal
          setShowInviteModal={setShowInviteModal}
          inviteToRoom={inviteToRoom}
        />
      )}

    </div>
  );
}
