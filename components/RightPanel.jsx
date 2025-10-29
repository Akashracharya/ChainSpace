"use client"

export default function RightPanel() {
  return (
    <aside className="w-96 p-4 border-l border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">AI Assistant</h4>
        <span className="text-xs text-slate-400">Context: last 6 msgs</span>
      </div>

      <div className="mt-4 p-3 bg-slate-800 rounded h-56 overflow-auto">
        <div className="text-sm text-slate-300">
          Ask the assistant about code, docs or project ideas.
        </div>
      </div>

      <div className="mt-4">
        <textarea
          className="w-full bg-transparent border border-slate-800 rounded p-2 h-24"
          placeholder="Ask AI..."
        />
        <div className="mt-2 flex justify-end">
          <button className="px-3 py-1 rounded bg-indigo-600">Ask</button>
        </div>
      </div>

      <div className="mt-6 text-xs text-slate-400">Members</div>
      <ul className="mt-2 space-y-2">
        <li className="p-2 bg-slate-800 rounded">
          alice.eth <span className="text-slate-500 text-xs">(owner)</span>
        </li>
        <li className="p-2 bg-slate-800 rounded">bob.eth</li>
        <li className="p-2 bg-slate-800 rounded">carol.eth</li>
      </ul>
    </aside>
  );
}
