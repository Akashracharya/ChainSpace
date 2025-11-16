'use client'
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeMessage({ lang, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-2 border border-white/10 rounded-xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-black px-4 py-1.5">
        <span className="text-[14px] uppercase text-slate-400 font-semibold mt-1 bg-black rounded-full  ">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-slate-100 transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 bg-black/20 text-sm overflow-x-auto">
        {/* *** DEVELOPER NOTE ***
          For real syntax highlighting, you must install a library.
          Run: npm install react-syntax-highlighter
          Then, import it and replace the <pre> block below with:
          
          import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
          import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
          
          <SyntaxHighlighter language={lang} style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent' }}>
            {code}
          </SyntaxHighlighter>
        */}
        <pre className="font-mono">{code}</pre>
      </div>
    </div>
  );
}