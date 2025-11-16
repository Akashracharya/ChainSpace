'use client'
import { useState } from 'react';
import { X } from 'lucide-react';

export default function InviteModal({ setShowInviteModal, inviteToRoom }) {
  const [address, setAddress] = useState("");

  const handleInvite = () => {
    // A simple check (a real app would use ethers.isAddress)
    if (address.trim().length === 42 && address.startsWith("0x")) {
      inviteToRoom(address.trim());
      setShowInviteModal(false);
    } else {
      alert("Please enter a valid Ethereum wallet address.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowInviteModal(false)}
      />
      {/* Modal Content */}
      <div className="relative z-60 w-[480px] bg-slate-900/50 border border-white/10 rounded-lg p-4 backdrop-blur-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-semibold">Invite Member</h5>
          <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div>
          <label htmlFor="address" className="text-sm text-slate-300">Wallet Address</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full mt-1 bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="0x..."
          />
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setShowInviteModal(false)}
            className="px-3 py-1 rounded hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="px-3 py-1 rounded bg-indigo-600 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/40"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}