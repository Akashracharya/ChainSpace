
'use client'

export default function MessageList({ messages }) {
  return (
    <div className="flex-1 overflow-auto p-6 space-y-4">
      {messages.map((m) => (
        <div key={m.id} className="p-3 rounded-md bg-slate-800">
          <div className="text-xs text-slate-400">{m.user}</div>
          <div className="whitespace-pre-wrap mt-1 text-sm">{m.text}</div>
        </div>
      ))}
    </div>
  );
}
