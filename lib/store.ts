// lib/store.ts
export type Room = {
  id: string;
  name: string;
  owner: string;      // wallet address
  members: string[];  // wallet addresses
  createdAt: number;
};

export type Message = {
  id: string;
  roomId: string;
  sender: string;     // wallet address
  text?: string;
  code?: string;
  lang?: string;
  createdAt: number;
};

class InMemoryStore {
  private rooms = new Map<string, Room>();
  private messagesByRoom = new Map<string, Message[]>();

  listRoomsFor(address: string): Room[] {
    const out: Room[] = [];
    for (const r of this.rooms.values()) {
      const isOwner = r.owner.toLowerCase() === address.toLowerCase();
      const isMember = r.members.some(m => m.toLowerCase() === address.toLowerCase());
      if (isOwner || isMember) out.push(r);
    }
    return out.sort((a, b) => b.createdAt - a.createdAt);
  }

  getRoom(id: string) {
    return this.rooms.get(id) || null;
  }

  createRoom(id: string, name: string, owner: string) {
    const exists = this.rooms.has(id);
    if (exists) throw new Error("Room already exists");
    const room: Room = {
      id, name, owner,
      members: [owner],
      createdAt: Date.now(),
    };
    this.rooms.set(id, room);
    this.messagesByRoom.set(id, []);
    return room;
  }

  addMember(roomId: string, wallet: string) {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error("Room not found");
    const exists = room.members.some(m => m.toLowerCase() === wallet.toLowerCase());
    if (!exists) room.members.push(wallet);
    return room;
  }

  postMessage(input: Omit<Message, "id" | "createdAt">) {
    const list = this.messagesByRoom.get(input.roomId);
    if (!list) throw new Error("Room not found");
    const msg: Message = { ...input, id: crypto.randomUUID(), createdAt: Date.now() };
    list.push(msg);
    return msg;
  }

  listMessages(roomId: string) {
    return (this.messagesByRoom.get(roomId) || []).slice().sort((a,b) => a.createdAt - b.createdAt);
  }
}

export const store = new InMemoryStore();
