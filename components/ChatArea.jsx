'use client'
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatArea({
  selectedRoom,
  messages,
  input,
  setInput,
  sendMessage,
  connected,
  setShowCodeModal,
  setShowNewRoomModal,
}) {
  return (
    <main className="flex-1 flex flex-col border-r border-white/10">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div>
          <h3 className="text-xl font-semibold">#{selectedRoom}</h3>
          <p className="text-sm text-slate-400">Private room — secure invites only</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-sm">
            Create Invite
          </button>
         <button 
            onClick={() => setShowNewRoomModal(true)} // <-- ADD ONCLICK
            disabled={!connected} // <-- DISABLE IF NOT LOGGED IN
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
        selectedRoom={selectedRoom}
      />
    </main>
  );
}
