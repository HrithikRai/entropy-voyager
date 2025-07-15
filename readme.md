# 🚀 Entropy Voyager

**Entropy Voyager** is a cross-platform desktop app built with **Electron** that transforms how users explore blockchain data on the Entropy testnet. Inspired by the early internet era of curiosity and discovery, it allows users to:

- 🗣️ **Talk to blockchain blocks** through natural language
- 🌐 **Visualize the chain** as an interactive graph
- 🤖 **Learn from a built-in AI assistant**

Whether you're a beginner or a seasoned developer, Entropy Voyager brings blockchain data to life.

---

## 🌟 Features

### 🗣️ BlockChat
Chat with any block using its number. Get a conversational summary of:
- Gas usage
- Transaction count
- Block author
- Hashes, timestamps, and logs

### 🌐 Entropy Browser
Graphically explore the latest blocks:
- Hover to inspect metadata
- Spot anomalies (gas spikes, health drops, missing transactions)
- Matrix-style UI for visual thrill

### 🤖 EntropyBot
A built-in AI assistant that:
- Explains blockchain concepts in simple terms
- Helps you navigate the app
- Answers questions about Entropy's ecosystem

---

## 🧰 Tech Stack

- **Electron** (with Electron Forge)
- **Polkadot JS API** for blockchain access
- **Cohere LLM API** for AI interaction
- **Docker** for containerized deployment
- Pure **HTML/CSS/JS** frontend with a retro-futuristic vibe

---

## 💻 Getting Started

### 🔧 Prerequisites

- Node.js (v18+)
- npm
- Git
- (Optional) Docker

### 📦 Clone and Install

```bash
git clone https://github.com/your-username/entropy-voyager.git
cd entropy-voyager
npm install
```

## Windows distributable provided

## Run with GUI on macOS or Windows
Install XQuartz (macOS) or VcXsrv (Windows)

```bash
export DISPLAY=host.docker.internal:0
docker run -it --rm -e DISPLAY=host.docker.internal:0 entropy-voyager
```

## Run with GUI on Linux
```bash
xhost +local:docker
docker run -it --rm \
  -e DISPLAY=$DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  entropy-voyager
```
