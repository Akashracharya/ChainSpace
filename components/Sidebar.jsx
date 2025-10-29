"use client"

export default function Sidebar({
  connected,
  connectWallet,
  selectedRoom,
  setSelectedRoom,
  rooms,
}) {
  return (
    <aside className="w-64 p-4 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">ChainSpace</h2>
        <button
          onClick={connectWallet}
          className={`px-3 py-1 text-sm rounded-md border ${
            connected
              ? "bg-slate-800 border-slate-700"
              : "bg-gradient-to-br from-indigo-600 to-purple-600"
          }`}
        >
          {connected ? "Connected" : "Connect"}
        </button>
      </div>

      <div className="text-xs uppercase text-slate-400 mb-2">Rooms</div>
      <nav className="space-y-2">
        {rooms.map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRoom(r)}
            className={`w-full text-left px-3 py-2 rounded-md hover:bg-slate-800 ${
              selectedRoom === r ? "bg-slate-800" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{r}</span>
              {r !== "general" && <span className="text-xs text-slate-500">🔒</span>}
            </div>
          </button>
        ))}
      </nav>

      <div className="mt-6 text-xs text-slate-400">
        <div>Logged in as:</div>
        <div className="mt-1 p-2 bg-slate-800 rounded">
          {connected ? "you.eth" : "Not connected"}
        </div>
      </div>
    </aside>
  );
}
