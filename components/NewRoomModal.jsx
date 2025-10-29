'use client'
import { useState } from 'react';
import { X } from 'lucide-react';

export default function NewRoomModal({ setShowNewRoomModal, createRoom }) {
  const [roomName, setRoomName] = useState("");

  const handleCreate = () => {
    // Basic validation
    if (roomName.trim()) {
      createRoom(roomName.trim().toLowerCase().replace(/\s+/g, '-'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowNewRoomModal(false)}
      />
      {/* Modal Content */}
      <div className="relative z-60 w-[400px] bg-slate-900/50 border border-white/10 rounded-lg p-4 backdrop-blur-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-semibold">Create New Room</h5>
          <button onClick={() => setShowNewRoomModal(false)} className="text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div>
          <label htmlFor="roomName" className="text-sm text-slate-300">Room Name</label>
          <input
            id="roomName"
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="w-full mt-1 bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="e.g. project-phoenix"
          />
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setShowNewRoomModal(false)}
            className="px-3 py-1 rounded hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-3 py-1 rounded bg-indigo-600 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/40"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}