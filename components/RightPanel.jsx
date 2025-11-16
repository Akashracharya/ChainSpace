"use client";
import FunAskButton from "./FunAskButton"; // add this at top
import CodeCard from "./codeCard";
import { useState } from "react";
import AiInput from "./Input"

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
    <aside className="w-96 p-4 border-l border-slate-800 bg-black-/20 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white">CSPACE AI 🤖</h4>
        <span className="text-xs text-slate-400">Context: chat helper</span>
      </div>

      {/* AI Response */}
      <CodeCard>
        {loading ? (
          <p className="italic text-slate-500 p-3">Thinking...</p>
        ) : response ? (
          <p className="whitespace-pre-wrap px-4">{response}</p>
        ) : (
          <p className="italic text-slate-500 p-3">
            Ask the assistant about code, docs, or project ideas.
          </p>
        )}
      </CodeCard>


      {/* Input box */}
      <div
      className="pt-5">
        <AiInput
          value={input}
          onChange={setInput}
          placeholder="Ask AI something..."
        />

        <div className="mt-2 flex justify-end">
          <div className="mt-2 flex justify-end">
            <FunAskButton loading={loading} onClick={handleAskAI} />
          </div>

        </div>
      </div>

      {/* Members list */}
      <div className="mt-6">
        <div className="text-xs text-slate-400 mb-2">Members</div>
        <ul className="space-y-2">
          <li className="p-2 bg-slate-800 rounded">
            akash.eth <span className="text-slate-500 text-xs">(owner)</span>
          </li>
          <li className="p-2 bg-slate-800 rounded">neha.eth</li>
          <li className="p-2 bg-slate-800 rounded">blaze.eth</li>
        </ul>
      </div>
    </aside>
  );
}
