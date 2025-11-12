"use client";

import { useState } from "react";

export default function RightPanel() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ sender: "user", text: input }],
          roomId: "ai-panel",
        }),
      });

      const data = await res.json();
      setResponse(data.reply || "⚠️ AI returned no response");
    } catch (err) {
      console.error("AI error:", err);
      setResponse("❌ AI request failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-96 p-4 border-l border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white">AI Assistant 🤖</h4>
        <span className="text-xs text-slate-400">Context: chat helper</span>
      </div>

      {/* AI Response */}
      <div className="flex-1 p-3 bg-slate-800 rounded-lg overflow-auto text-sm text-slate-300 mb-4">
        {loading ? (
          <p className="italic text-slate-500">Thinking...</p>
        ) : response ? (
          <p className="whitespace-pre-wrap">{response}</p>
        ) : (
          <p className="italic text-slate-500">
            Ask the assistant about code, docs, or project ideas.
          </p>
        )}
      </div>

      {/* Input box */}
      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-transparent border border-slate-700 rounded p-2 h-24 text-white resize-none focus:outline-none"
          placeholder="Ask AI something..."
        />

        <div className="mt-2 flex justify-end">
          <button
            onClick={handleAskAI}
            disabled={loading}
            className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      </div>

      {/* Members list */}
      <div className="mt-6">
        <div className="text-xs text-slate-400 mb-2">Members</div>
        <ul className="space-y-2">
          <li className="p-2 bg-slate-800 rounded">
            alice.eth <span className="text-slate-500 text-xs">(owner)</span>
          </li>
          <li className="p-2 bg-slate-800 rounded">bob.eth</li>
          <li className="p-2 bg-slate-800 rounded">carol.eth</li>
        </ul>
      </div>
    </aside>
  );
}
