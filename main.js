const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { fetchBlockDetails } = require('./blockchain');
const { askLLM } = require('./llm');

let cachedBlockData = null;

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
}

ipcMain.handle('fetch-block', async (event, blockHashOrLatest) => {
  const blockData = await fetchBlockDetails(blockHashOrLatest);
  cachedBlockData = blockData;
  return blockData;
});

ipcMain.handle('ask-llm', async (event, question) => {
  if (!cachedBlockData) return 'No block data available.';
  return await askLLM(question, cachedBlockData);
});

app.whenReady().then(createWindow);
