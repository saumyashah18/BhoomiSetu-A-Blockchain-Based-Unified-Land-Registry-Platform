# 🏆 BhoomiSetu: Technical Judging Guide

## 🎯 The Problem: Data Silos vs. Public Trust
Traditional land registries are either private (vulnerable to corruption) or fully public (scaling/privacy issues). **BhoomiSetu** solves this with a **Hybrid Blockchain Architecture**.

---

## 🏗️ Technical Architecture

### 1. Authoritative Layer (Hyperledger Fabric)
- **Role:** Primary Ledger. 
- **Function:** Handles governance, land transfers, and complex property metadata. 
- **Privacy:** Permissioned network ensuring only authorized registrars can commit data.
- **Ledger:** SHA256 hashes of all assets are stored in the Fabric State DB.

### 2. Public Verification Layer (Polygon Amoy)
- **Role:** Immutable Proof.
- **Function:** Periodic "anchoring" of Fabric state hashes to the public Ethereum network.
- **Transparency:** Anyone in the world can verify that a specific land record has not been tampered with by comparing its local hash with the public anchor on Amoy.

---

## 🔍 How to Evaluate

### Step 1: Browse the Demo
- **URL:** [Frontend URL (Vercel)]
- **API (Tunneled):** `https://bhoomisetu-api.loca.lt`
- **Click the "🏆 Evaluation" Button** in the menu to see the live flow.

### Step 2: Verify the Public Proof
Our smart contract is live on the **Polygon Amoy Testnet**:
- **Contract Address:** `0x0bb955b22105bA7D6F89aBCbEE1860e4DAD85A79`
- **AmoyScan:** [Visit Contract](https://amoy.polygonscan.com/address/0x0bb955b22105bA7D6F89aBCbEE1860e4DAD85A79)

### Step 3: Audit the Hybrid Flow
1. Create a Land Record (via Registrar Console).
2. Observe the **SHA256 Hash** generation.
3. Follow the link to the **Polygon Transaction**.
4. Witness how a local private event becomes a globally verifiable public receipt.

---

## 🛠️ Stack & Tools
- **Hyperledger Fabric v2.5** (Peers, CAs, Orderer, CouchDB)
- **Solidity** (AnchorRegistry Contract)
- **Web3.js / Hardhat**
- **React + Tailwind** (Premium Glassmorphism UI)
- **Localtunnel** (Secure bridge for cross-chain evaluation)

---

## 🏁 Summary
BhoomiSetu isn't just a database; it's a bridge between enterprise-grade privacy and public-grade trust. By anchoring private Fabric events to the public Polygon network, we ensure **Zero-Knowledge Trust**—judges and citizens can verify integrity without seeing sensitive data.
