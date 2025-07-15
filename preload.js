const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('entropyAPI', {
  fetchBlock: (hashOrLatest) => ipcRenderer.invoke('fetch-block', hashOrLatest),
  askLLMChat: (question) => ipcRenderer.invoke('ask-llm-blockchat', question),
});
