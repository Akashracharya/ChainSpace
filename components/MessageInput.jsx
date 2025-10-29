'use client'
import { Code } from 'lucide-react';

export default function MessageInput({
  input,
  setInput,
  sendMessage,
  connected: isAuthenticated,
  setShowCodeModal,
  selectedRoom,
}) {
  // Define disabled states
  const isChatDisabled = !isAuthenticated; // Use isAuthenticated
  const isSendDisabled = !isAuthenticated || !input.trim(); // Use isAuthenticated

  return (
    <div className="p-4 border-t border-white/10 flex items-start gap-3">
      <button
        title="Attach code snippet"
        onClick={() => setShowCodeModal(true)}
        disabled={isChatDisabled} // Add disabled state
        className={`p-2 rounded-md transition-colors text-slate-400 ${
          isChatDisabled
            ? "text-slate-600 cursor-not-allowed"
            : "hover:bg-white/10 hover:text-slate-100"
        }`}
      >
        <Code className="w-5 h-5" />
      </button>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={isAuthenticated ? "Message #" + selectedRoom : "Connect wallet to chat"}
        disabled={isChatDisabled} // Use new variable
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isSendDisabled) {
            sendMessage();
          }
        }}
      />

      <button
        onClick={sendMessage}
        disabled={isSendDisabled} // Use new variable
        className={`px-4 py-2 rounded font-medium transition-colors ${
          isSendDisabled
            ? "bg-indigo-900/50 text-slate-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500"
        }`}
      >
        Send
      </button>
    </div>
  );
}