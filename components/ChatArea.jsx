'use client'
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatArea({
  room,
  selectedRoom,
  messages,
  input,
  setInput,
  sendMessage,
  connected,
  setShowCodeModal,
  setShowNewRoomModal,
  setShowInviteModal, // <-- RECEIVE NEW PROP
  isOwner,
}) {
const isPublic = room?.members?.includes("everyone") ?? false;

  return (
    <main className="flex-1 flex flex-col border-r border-white/10">
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">#{room.id}</h3>
          <p className="text-sm text-slate-400">
            {/* Show room privacy status */}
            {isPublic ? "Public Room" : "Private Room - Members Only"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowInviteModal(true)} // <-- ADD ONCLICK
            disabled={!connected || isPublic || !isOwner} // <-- ADD LOGIC
            className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Invite
          </button>
          <button 
            onClick={() => setShowNewRoomModal(true)}
            disabled={!connected}
            className="px-3 py-1 rounded bg-gradient-to-br from-indigo-600 to-purple-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            New Room
          </button>
        </div>
      </header>

      <MessageList messages={messages} />

      <MessageInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        connected={connected}
        setShowCodeModal={setShowCodeModal}
        selectedRoom={room.id} // Pass room.id here
      />
    </main>
  );
}
