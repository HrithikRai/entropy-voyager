const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { fetchBlockDetails } = require('./blockchain');
const { askLLMChat } = require('./llm');
const { askLLM } = require('./browserllm');

const llmCache = new Map(); 
let cachedBlockData = null;
let cache = null;

ipcMain.handle('fetchBlocks', async (_event, count = 10) => {
  try {
    const provider = new WsProvider('wss://testnet.entropy.xyz');
    const api = await ApiPromise.create({ provider });

    const lastHeader = await api.rpc.chain.getHeader();
    const latestBlock = lastHeader.number.toNumber();
    const blocks = [];

    for (let i = latestBlock; i > latestBlock - count; i--) {
      const hash = await api.rpc.chain.getBlockHash(i);
      const signedBlock = await api.rpc.chain.getBlock(hash);
      const header = signedBlock.block.header;

      const extrinsics = signedBlock.block.extrinsics.map((ex, idx) => ({
        index: idx,
        method: ex.method.toHuman(),
      }));

      const events = await api.query.system.events.at(hash);
      const eventData = events.map(({ event, phase }) => ({
        phase: phase.toString(),
        section: event.section,
        method: event.method,
        data: event.data.toHuman()
      }));

      const timestamp = await api.query.timestamp.now.at(hash);

      blocks.push({
        number: header.number.toNumber(),
        hash: hash.toHex(),
        parentHash: header.parentHash.toHex(),
        stateRoot: header.stateRoot.toHex(),
        author: header.author?.toString() || 'Unknown',
        extrinsics,
        events: eventData,
        timestamp: timestamp.toNumber()
      });
    }

    await api.disconnect();
    cachedBlockData = blocks; // store rich blocks for LLM use
    return blocks;
  } catch (err) {
    console.error('❌ Error fetching blocks:', err);
    return [];
  }
});

ipcMain.handle('ask-llm', async (_event, question, blockNumber) => {
  if (!cachedBlockData) return 'No block data available.';

  const blockData = cachedBlockData.find(b => b.number == blockNumber);
  if (!blockData) return `Block ${blockNumber} not found.`;

  const cacheKey = `${blockNumber}:${question.trim().toLowerCase()}`;
  if (llmCache.has(cacheKey)) {
    console.log(`⚡ Serving cached LLM response for block ${blockNumber}`);
    return llmCache.get(cacheKey);
  }

  const response = await askLLM(question, blockData);
  llmCache.set(cacheKey, response); // ✅ Cache it
  return response;
});

ipcMain.handle('fetch-block', async (event, blockHashOrLatest) => {
  const blockData = await fetchBlockDetails(blockHashOrLatest);
  cache = blockData;
  return blockData;
});

ipcMain.handle('ask-llm-blockchat', async (event, question) => {
  if (!cache) return 'No block data available.';
  return await askLLMChat(question, cache);
});

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);