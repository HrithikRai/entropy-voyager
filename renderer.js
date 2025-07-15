function formatBlockData(data) {
  const lines = [];

  lines.push("✅ Connected to Entropy Network!");
  lines.push("----------------------------");
  lines.push(`📛 Chain: ${data.chain}`);
  lines.push(`🖥️ Node Name: ${data.nodeName}`);
  lines.push(`🧩 Node Version: ${data.nodeVersion}`);
  lines.push(`🔗 Genesis Hash: ${data.genesisHash}`);
  lines.push(`🧬 Runtime Version: ${data.runtimeVersion}`);

  lines.push('');
  lines.push(`📦 Latest Block: #${data.blockNumber} (${data.hash})`);
  lines.push('');

  if (data.balance) {
    lines.push(`💳 Balance for ${data.balance.address}:`);
    lines.push(`   - Free: ${data.balance.free}`);
    lines.push(`   - Reserved: ${data.balance.reserved}`);
    lines.push(`   - Misc Frozen: ${data.balance.miscFrozen}`);
    lines.push(`   - Fee Frozen: ${data.balance.feeFrozen}`);
    lines.push('');
  }

  data.events.forEach((e) => {
    lines.push(`📣 Event: ${e.section}.${e.method}`);
    lines.push(`🧾 Details: ${e.documentation || 'No documentation available'}`);
    lines.push(`🔢 Phase: ${JSON.stringify(e.phase)}`);
    lines.push(`📦 Data: ${JSON.stringify(e.data)}`);
    lines.push('--------------------------');
  });

  if (data.health) {
    lines.push(`📡 Peers: ${data.health.peers}, Is Syncing: ${data.health.isSyncing}, Should Have Peers: ${data.health.shouldHavePeers}`);
  }

  return `<pre>${lines.join('\n')}</pre>`;
}

async function fetchBlock() {
  const blockInput = document.getElementById('blockInput').value || 'latest';
  const data = await window.entropyAPI.fetchBlock(blockInput);
  document.getElementById('blockData').innerHTML = formatBlockData(data);
  document.getElementById('responseArea').innerHTML = ''; // clear previous answer
}

async function askQuestion() {
  const question = document.getElementById('questionInput').value;
  const answer = await window.entropyAPI.askLLMChat(question);
  document.getElementById('responseArea').innerHTML = `<pre>🤖 ${answer}</pre>`;
}
