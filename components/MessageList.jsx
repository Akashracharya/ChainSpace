'use client';
import { useEffect, useState } from "react";
import { decryptText } from "../lib/simpleCrypto";
import CodeMessage from "./CodeMessage"; // Import the new component


const formatAddress = (addr) => {
  if (!addr) return "Not connected";
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

function formatMessageTime(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.toDateString() === yesterday.toDateString();

  const timeString = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) return `Today at ${timeString}`;
  if (isYesterday) return `Yesterday at ${timeString}`;

  // Otherwise: Jan 25, 2025 at 5:00 PM
  const dateString = date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${dateString} at ${timeString}`;
}

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
          
          
          <div className="flex items-center gap-[290px]">
            <span className="text-xs text-slate-400 bg-black rounded-full p-1 px-3 w-fit">
              {formatAddress(m.sender)}
            </span>

            {/* Timestamp with hover tooltip */}
            <span
              className="text-[13px] bg-black rounded-xl p-[1px] px-3 text-slate-400"
              title={new Date(m.created_at).toString()}
            >
              {formatMessageTime(m.created_at)}
            </span>
          </div>
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
