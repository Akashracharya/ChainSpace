<div align="center">

<img src="./public/assets/banner.png" width="800" alt="ChainSpace Banner"/>

# 🚀 ChainSpace
### Decentralized Encrypted Developer Chat Platform

**🔐 Blockchain-Powered | 📨 End-to-End Encrypted | 🧠 AI Integrated | ⚡ Real-time**

<p>
ChainSpace is a Web3 chat platform where users authenticate with Ethereum wallets, manage rooms via smart contracts, and communicate with AES-256 encryption. It features a built-in AI assistant powered by Gemini 2.0.
</p>

</div>

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🎥 Demo Screenshots](#-demo-screenshots)
- [🧠 Architecture Overview](#-architecture-overview)
- [⚙️ Tech Stack](#-tech-stack)
- [📦 Installation & Setup](#-installation--setup)
- [📘 Smart Contract Details](#-smart-contract-details)
- [🔐 End-to-End Encryption](#-end-to-end-encryption)
- [🧪 Testing the App](#-testing-the-app)
- [🛠 Future Improvements](#-future-improvements)
- [📄 License](#-license)

---

## ✨ Features

### 🧬 1. Wallet-based Authentication (SIWE)
- Secure login using **Sign-in With Ethereum (SIWE)**.
- No traditional username/password required.

### 🔐 2. On-Chain Room Ownership & Permissions
- Rooms are created directly on the **Smart Contract**.
- Only the room owner can add members.
- Access is verified using `isMember()` & `isOwner()` on the blockchain.

### 📝 3. Encrypted Messaging (AES-256-GCM)
Each room generates a dynamic key. Messages stored in Supabase are **ciphertext**, never plain text.
```javascript
const SECRET = `${roomId}-chainspace-secret`;
// Messages are encrypted/decrypted client-side