const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('entropyAPI', {
  fetchBlock: (hashOrLatest) => ipcRenderer.invoke('fetch-block', hashOrLatest),
  askLLM: (question) => ipcRenderer.invoke('ask-llm', question),
});
