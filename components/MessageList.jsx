'use client';
import { useEffect, useState } from "react";
import { decryptText } from "../lib/simpleCrypto";
import CodeMessage from "./CodeMessage"; // Import the new component


const formatAddress = (addr) => {
  if (!addr) return "Not connected";
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

export default function MessageList({ messages, selectedRoom }) {
  const [visibleMessages, setVisibleMessages] = useState([]);

  useEffect(() => {
    if (!messages.length) return;

    const SECRET = `${selectedRoom}-chainspace-secret`;

    async function decryptAll() {
      const decrypted = await Promise.all(
        messages.map(async (m) => {
          // 🔐 If message is encrypted, decrypt before showing
          if (m.encrypted && m.ciphertext && m.iv) {
            const plain = await decryptText(SECRET, m.ciphertext, m.iv);
            return { ...m, text: plain };
          }
          return m;
        })
      );
      setVisibleMessages(decrypted);
    }

    decryptAll();
  }, [messages, selectedRoom]);

  return (
    <div className="flex-1 overflow-auto p-6 space-y-4 ">
      {visibleMessages.map((m) => (
        <div key={m.id} className="p-3 rounded-xl bg-[#011522] backdrop-blur-sm animate-in fade-in">
        
          <div className="text-xs text-slate-400 bg-black rounded-full p-2 px-3 w-fit">{formatAddress(m.sender)}</div>

          {/* Conditional Rendering for code or text */}
          {m.type === "code" ? (
            <CodeMessage lang={m.lang} code={m.text} />
          ) : (
            <div className="whitespace-pre-wrap mt-1 text-lg pl-2">{m.text}</div>
          )}
        </div>
      ))}
    </div>
  );
}
