'use client'


export default function CodeModal({
  codeSnippet,
  setCodeSnippet,
  attachCode,
  setShowCodeModal,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setShowCodeModal(false)}
      />
      <div className="relative z-60 w-[720px] bg-slate-900 border border-slate-800 rounded p-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-semibold">Attach Code Snippet</h5>
          <button onClick={() => setShowCodeModal(false)}>Close</button>
        </div>

        <div className="flex gap-2">
          <select
            value={codeSnippet.lang}
            onChange={(e) =>
              setCodeSnippet((s) => ({ ...s, lang: e.target.value }))
            }
            className="bg-slate-800 p-2 rounded"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="solidity">Solidity</option>
          </select>

          <textarea
            value={codeSnippet.code}
            onChange={(e) =>
              setCodeSnippet((s) => ({ ...s, code: e.target.value }))
            }
            className="flex-1 h-40 bg-transparent border border-slate-800 rounded p-2 font-mono"
            placeholder="Paste code here..."
          />
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={() => setShowCodeModal(false)}
            className="px-3 py-1 rounded"
          >
            Cancel
          </button>
          <button onClick={attachCode} className="px-3 py-1 rounded bg-indigo-600">
            Attach
          </button>
        </div>
      </div>
    </div>
  );
}
