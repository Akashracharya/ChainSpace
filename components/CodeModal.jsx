'use client'
import { X } from 'lucide-react'; 

export default function CodeModal({
  codeSnippet,
  setCodeSnippet,
  attachCode,
  setShowCodeModal,
}) {
  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowCodeModal(false)}
      />
      <div className="relative z-60 w-[720px] bg-slate-900/50 border border-white/10 rounded-xl p-4 backdrop-blur-lg shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-semibold">Attach Code Snippet</h5>
          <button onClick={() => setShowCodeModal(false)} className="text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2"> {/* Changed to flex-col for better layout */}
          <select
            value={codeSnippet.lang}
            onChange={(e) =>
              setCodeSnippet((s) => ({ ...s, lang: e.target.value }))
            }
            className="bg-slate-800/50 border border-white/10 p-2 rounded w-full" // Made full-width
          >
            {/* New language list */}
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="solidity">Solidity</option>
          </select>

          <textarea
            value={codeSnippet.code}
            onChange={(e) =>
              setCodeSnippet((s) => ({ ...s, code: e.target.value }))
            }
            className="flex-1 min-h-[200px] bg-white/5 border border-white/10 rounded p-2 font-mono" // Updated height
            placeholder="Paste code here..."
          />
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={() => setShowCodeModal(false)}
            className="px-3 py-1 rounded hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={attachCode} 
            className="px-3 py-1 rounded bg-indigo-600 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/40" // Added glow effect
          >
            Attach
          </button>
        </div>
      </div>
    </div>
  );
}
