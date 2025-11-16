"use client"

export default function Sidebar({
  connected,
  connectWallet,
  selectedRoom,
  setSelectedRoom,
  rooms,
  account,
}) {
  const formatAddress = (addr) => {
    if (!addr) return "Not connected";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  return (
    <aside className="w-64 p-4 border-r border-white/10">
      <div className=" items-center justify-between mb-6">
        <h2 className="text-3xl m-3  pb-3 flex font-semibold">CHAINSPACE</h2>
        <button
          onClick={connectWallet}
          disabled={connected}
          className={` flex items-center mx-4 ml-8 justify-between w-[160px] rounded-full shadow-md cursor-pointer
    ${connected ? "bg-slate-800 border border-slate-700" : "bg-[#1d2129]"} 
  `}
        >
          <span className="flex-1 text-center text-white text-[1.1em] pl-2 tracking-[1.2px]">
            {connected ? "Connected" : "Connect"}
          </span>

          {/* Icon container */}
          <span
            className="w-[45px] h-[45px] rounded-full bg-[#f59aff] border-[3px] border-[#1d2129] flex items-center justify-center"
          >
            <svg
              width={16}
              height={19}
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-arrow"
            >
              <circle cx="1.61321" cy="1.61321" r="1.5" fill="black" />
              <circle cx="5.73583" cy="1.61321" r="1.5" fill="black" />
              <circle cx="5.73583" cy="5.5566" r="1.5" fill="black" />
              <circle cx="9.85851" cy="5.5566" r="1.5" fill="black" />
              <circle cx="9.85851" cy="9.5" r="1.5" fill="black" />
              <circle cx="13.9811" cy="9.5" r="1.5" fill="black" />
              <circle cx="5.73583" cy="13.4434" r="1.5" fill="black" />
              <circle cx="9.85851" cy="13.4434" r="1.5" fill="black" />
              <circle cx="1.61321" cy="17.3868" r="1.5" fill="black" />
              <circle cx="5.73583" cy="17.3868" r="1.5" fill="black" />
            </svg>
          </span>
        </button>
      </div>

      <div className="text-[15px] uppercase text-slate-400 mb-2">Rooms</div>
      <nav className="space-y-2">
        {rooms.map((r) => (
          <button
            key={`${r.id}-${r.owner || "system"}`}
            onClick={() => setSelectedRoom(r.id)} // Call with room id
            className={`w-full text-left px-3 py-2 rounded-[6px] transition-colors hover:bg-white/10 ${selectedRoom === r.id ? "bg-white/20" : "" // Compare with r.id
              }`}
          >
            <div className="flex items-center justify-between">
              <span>{r.id}</span>
              {/* Show lock if not public */}
              {(r.members && !r.members.includes("everyone")) && (
                <span className="text-xs text-slate-500">🔒</span>
              )}

            </div>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 m-9 mx-5  text-slate-400">
        <div className="text-[16px] pb-1.5 ml-2">Logged in as:</div>
        <div className="mt-1 p-1 bg-slate-800 rounded-full px-5 text-[16px]">
          {formatAddress(account)}
        </div>
      </div>
    </aside>
  );
}
