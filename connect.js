const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
  // Connect to Entropy Testnet
  const provider = new WsProvider('wss://testnet.entropy.xyz');
  const api = await ApiPromise.create({ provider });
  

  // 1. Basic chain information
  const [chain, nodeName, nodeVersion, genesisHash, runtimeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
    api.genesisHash.toHex(),
    api.runtimeVersion
  ]);

  console.log('✅ Connected to Entropy Network!');
  console.log('----------------------------');
  console.log(`📛 Chain: ${chain}`);
  console.log(`🖥️ Node Name: ${nodeName}`);
  console.log(`🧩 Node Version: ${nodeVersion}`);
  console.log(`🔗 Genesis Hash: ${genesisHash}`);
  console.log(`🧬 Runtime Version: ${runtimeVersion.specVersion}`);
  console.log('');

  // 2. Latest block
  const lastHeader = await api.rpc.chain.getHeader();
  console.log(`📦 Latest Block: #${lastHeader.number} (${lastHeader.hash.toHex()})`);
  console.log('');

  // 3. Listen to new blocks
  api.rpc.chain.subscribeNewHeads((lastHeader) => {
    console.log(`⏱️  New Block: #${lastHeader.number} (${lastHeader.hash.toHex()}) at ${new Date().toLocaleTimeString()}`);
  });

  // 4. Listen to all events (like signing requests or threshold ops)
  api.query.system.events((events) => {
    events.forEach(({ event, phase }) => {
      console.log(`📣 Event: ${event.section}.${event.method}`);
      const doc = event.meta?.documentation?.toArray?.() || [];
      console.log(`🧾 Details: ${doc.join(' ') || 'No documentation available'}`);

      console.log(`🔢 Phase: ${phase.toString()}`);
      console.log(`📦 Data: ${event.data.toString()}`);
      console.log('--------------------------');
    });
  });

  // 5. Sample account details (replace with real account)
  const SAMPLE_ADDRESS = '0xf595152f957e7c4e459d37ed75eabc2ec60e6e0b8a93785976173b0db3f7df9c'; // dummy
  const { data: balance } = await api.query.system.account(SAMPLE_ADDRESS);
  console.log(`💳 Balance for ${SAMPLE_ADDRESS}:`);
  console.log(`   - Free: ${balance.free}`);
  console.log(`   - Reserved: ${balance.reserved}`);
  console.log(`   - Misc Frozen: ${balance.miscFrozen}`);
  console.log(`   - Fee Frozen: ${balance.feeFrozen}`);
  console.log('');

  // 6. Check network health
  const health = await api.rpc.system.health();
  console.log(`📡 Peers: ${health.peers}, Is Syncing: ${health.isSyncing}, Should Have Peers: ${health.shouldHavePeers}`);

  // 7. Subscribe to threshold signing sessions (if module available)
  if (api.query.thresholdSigning) {
    api.query.thresholdSigning.activeSessions((sessions) => {
      console.log('🔐 Active Threshold Signing Sessions:', sessions.toHuman());
    });
  }
}

main().catch(console.error).finally(() => process.exit());

// Feature	Value to User
// Chain Name & Version	Ensures the user is connected to the correct testnet/mainnet
// Genesis Hash	Used for trust, replay protection, fork detection
// Block Info	Shows real-time activity – is the network alive and processing?
// Balance Check	Allows wallet interfaces or apps to track funds
// Event Logs	Helps developers debug and users understand if their tx was successful
// Peer/Sync Status	Crucial for node operators or dApp devs to ensure availability