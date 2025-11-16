🚀 ChainSpace – Decentralized Encrypted Developer Chat Platform
🔐 Blockchain-Powered | 📨 End-to-End Encrypted Rooms | 🧠 Integrated AI Assistant | ⚡ Real-time Messaging

ChainSpace is a Web3 chat platform where:

Users authenticate with Ethereum wallets

Rooms are created and managed on a smart contract

Messages are stored in Supabase but encrypted with AES-256

Only users who are invited on-chain can read + send messages

Includes a built-in AI assistant powered by Gemini API

<p align="center"> <img src="./public/assets/banner.png" width="800"/> </p>
📌 Table of Contents

✨ Features

🎥 Demo Screenshots

🧠 Architecture Overview

⚙️ Tech Stack

📦 Installation & Setup

📘 Smart Contract Details

🔐 End-to-End Encryption

🧠 AI Assistant

🗄 API Routes

🧪 Testing the App

🛠 Future Improvements

📄 License

✨ Features
🧬 1. Wallet-based Authentication (SIWE)

Secure login using Sign-in With Ethereum (SIWE).

🔐 2. On-Chain Room Ownership & Permissions

Rooms created on smart contract

Only room owner can add members

Verified using isMember() & isOwner() from smart contract

📝 3. Encrypted Messaging (AES-256-GCM)

Each room has its own dynamic key:

const SECRET = `${roomId}-chainspace-secret`


Messages stored in Supabase are ciphertext, not plain text.

⚡ 4. Real-time Messaging

Supabase Realtime streams new messages instantly.

🧠 5. AI Assistant Panel

Powered by Gemini 2.0 API

Custom interactive input

Code-friendly response UI

🎨 6. Beautiful UI

Galaxy animated background

Styled components + Tailwind

Custom 3D buttons and neon inputs

🎥 Demo Screenshots


💬 Encrypted Chat Room
<img src="./public/assets/demo-chat.png" width="800" />
Connect to Chainspace
<img src="./public/assets/demo-access-main.png" width="800" />
Invite Member
<img src="./public/assets/invite.png" width="800" />
🔒 Access Denied (Non-member)
<img src="./public/assets/demo-access.png" width="800" />
🤖 AI Assistant Panel
<img src="./public/assets/demo-ai.png" width="800" />
🧠 Architecture Overview
┌──────────────────────────┐
│        Frontend          │
│ Next.js + Tailwind       │
│ Wallet connect + UI      │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│    Smart Contract        │
│  RoomFactory.sol         │
│ - createRoom()           │
│ - addMember()            │
│ - isMember()             │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│        Backend API       │
│ Next.js API Routes       │
│ Validates on-chain auth  │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│        Supabase          │
│ Stores encrypted msgs    │
│ Real-time subscriptions  │
└──────────────────────────┘

⚙️ Tech Stack
Frontend

Next.js 14 App Router

Tailwind CSS

Styled Components

Ethers.js (v6)

SIWE (Sign-In With Ethereum)

Blockchain

Solidity Smart Contract

Hardhat Local Node

Ethers.js Contract Calls

Backend

Next.js API Routes

Supabase Database

AES-GCM Encryption

AI

Gemini 2.0 Flash API

📦 Installation & Setup
1️⃣ Clone the repo
git clone https://github.com/YOUR_USERNAME/chainspace.git
cd chainspace

2️⃣ Install dependencies
npm install

3️⃣ Start Hardhat local blockchain
npx hardhat node

4️⃣ Deploy the smart contract
npx hardhat run scripts/deploy.js --network localhost


Copy the deployed contract address → paste into your lib/blockchain.js.

5️⃣ Start Supabase

Create tables:
rooms, members, messages

6️⃣ Add Environment Variables

Create .env.local:

NEXT_PUBLIC_SUPABASE_URL=xxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
GEMINI_API_KEY=xxxx
NEXT_PUBLIC_CONTRACT_ADDRESS=xxxx

7️⃣ Start the dev server
npm run dev

📘 Smart Contract Details
RoomFactory.sol
✔ createRoom(roomId, name)

Deploys a secure room + adds owner as first member.

✔ addMember(roomId, wallet)

Only room owner can invite.

✔ isMember(roomId, address)

Used by backend to verify read+write permission.

✔ isOwner(roomId, address)

Used for showing UI controls like "Invite".

🔐 End-to-End Encryption

Messages are encrypted before leaving the browser using:

AES-256-GCM

Strong symmetric encryption

Random IV on each message

Authed encryption mode

Example:
const SECRET = `${selectedRoom}-chainspace-secret`;

const { ciphertext, iv } = await encryptText(SECRET, message);


Supabase only stores:

{
  "ciphertext": "dw892h93d2...",
  "iv": "f3982hf98hf...",
  "encrypted": true
}


On load:

decryptText(SECRET, ciphertext, iv)


Only members know the key → zero-knowledge server.

🧠 AI Assistant

Uses Gemini 2.0 Flash:


Summaries

Code explanations

Room-context understanding

🗄 API Routes
Route	Method	Description
/api/verify	POST	SIWE Login verification
/api/rooms	GET/POST	Room creation
/api/rooms/[id]	GET	Room info
/api/rooms/[id]/members	POST	Add member
/api/rooms/[id]/messages	GET/POST	Encrypted messaging
🧪 Testing the App
✔ Test Room Creation

Wallet A creates room

Wallet B should not see messages

After invite → wallet B can read + send

✔ Test Encryption

Open Supabase → messages table
→ ciphertext must not be readable

✔ Test AI

Right panel → ask AI → response appears in card.

🛠 Future Improvements

🔑 Per-user encryption keys

♻️ Room key rotation

🧩 File sharing (encrypted)

🔔 Push notifications

📱 Mobile UI redesign

📦 Export chat history (decrypted)

📄 License

MIT License © 2025 ChainSpace