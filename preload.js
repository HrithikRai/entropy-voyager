const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('entropyAPI', {
  fetchBlock: (hashOrLatest) => ipcRenderer.invoke('fetch-block', hashOrLatest),
  fetchBlocks: (count = 10) => ipcRenderer.invoke('fetchBlocks', count),
  askLLMChat: (question) => ipcRenderer.invoke('ask-llm-blockchat', question),
  askLLM: (question, blockNumber) => ipcRenderer.invoke('ask-llm', question, blockNumber),
});
