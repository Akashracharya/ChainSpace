'use client'
import CodeMessage from './CodeMessage'; // Import the new component

export default function MessageList({ messages }) {
  return (
    <div className="flex-1 overflow-auto p-6 space-y-4">
      {messages.map((m) => (
        // Added animation classes to this wrapper div
        <div key={m.id} className="p-3 rounded-lg bg-black/20 backdrop-blur-sm animate-in fade-in">
          <div className="text-xs text-slate-400">{m.user}</div>
          
          {/* Conditional Rendering */}
          {m.type === 'code' ? (
            <CodeMessage lang={m.lang} code={m.text} />
          ) : (
            <div className="whitespace-pre-wrap mt-1 text-sm">{m.text}</div>
          )}
        </div>
      ))}
    </div>
  );
}