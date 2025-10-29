'use client'
import { Code } from 'lucide-react';

export default function MessageInput({
  input,
  setInput,
  sendMessage,
  connected,
  setShowCodeModal,
  selectedRoom,
}) {
  return (
    <div className="p-4 border-t border-white/10 flex items-start gap-3">
      <button
        title="Attach code snippet"
        onClick={() => setShowCodeModal(true)}
        className="p-2 rounded-md transition-colors hover:bg-white/10 text-slate-400 hover:text-slate-100"
      >
        <Code className="w-5 h-5" /> {/* Use the icon here */}
      </button>

      <input
        // ...props
        className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />

      <button onClick={sendMessage} className="px-4 py-2 rounded bg-indigo-600">
        Send
      </button>
    </div>
  );
}
