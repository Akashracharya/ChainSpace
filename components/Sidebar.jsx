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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">ChainSpace</h2>
        <button
          onClick={connectWallet}
          disabled={connected}
          className={`px-3 py-1 text-sm rounded-md border ${
            connected
              ? "bg-slate-800 border-slate-700"
              : "bg-gradient-to-br from-indigo-600 to-purple-600"
          }`}
        >
          {connected ? "Connected" : "Connect Wallet"}
        </button>
      </div>

      <div className="text-xs uppercase text-slate-400 mb-2">Rooms</div>
      <nav className="space-y-2">
        {rooms.map((r) => (
          <button
            key={`${r.id}-${r.owner || "system"}`}
            onClick={() => setSelectedRoom(r.id)} // Call with room id
            className={`w-full text-left px-3 py-2 rounded-md transition-colors hover:bg-white/10 ${
              selectedRoom === r.id ? "bg-white/20" : "" // Compare with r.id
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

      <div className="mt-6 text-xs text-slate-400">
        <div>Logged in as:</div>
        <div className="mt-1 p-2 bg-slate-800 rounded">
          {formatAddress(account)}
        </div>
      </div>
    </aside>
  );
}
