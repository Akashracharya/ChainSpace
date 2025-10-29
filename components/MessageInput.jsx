'use client'


export default function MessageInput({
  input,
  setInput,
  sendMessage,
  connected,
  setShowCodeModal,
  selectedRoom,
}) {
  return (
    <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-start gap-3">
      <button
        title="Attach code snippet"
        onClick={() => setShowCodeModal(true)}
        className="p-2 rounded-md hover:bg-slate-800"
      >
        {"</>"}
      </button>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 bg-transparent border border-slate-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        placeholder={connected ? "Message #" + selectedRoom : "Connect wallet to chat"}
        disabled={!connected}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button onClick={sendMessage} className="px-4 py-2 rounded bg-indigo-600">
        Send
      </button>
    </div>
  );
}
