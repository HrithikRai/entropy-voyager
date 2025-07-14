const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
  const provider = new WsProvider('wss://testnet.entropy.xyz');
  const api = await ApiPromise.create({ provider });

  console.log(`✅ Connected to ${await api.rpc.system.chain()}`);

  const latestHeader = await api.rpc.chain.getHeader();
  const latestBlockNumber = latestHeader.number.toNumber();

  const NUM_BLOCKS = 5; // 🔢 You can change this to 10, 50, etc.

  console.log(`\n📦 Fetching last ${NUM_BLOCKS} blocks...\n`);

  for (let i = latestBlockNumber; i > latestBlockNumber - NUM_BLOCKS; i--) {
    const blockHash = await api.rpc.chain.getBlockHash(i);
    const block = await api.rpc.chain.getBlock(blockHash);
    const header = block.block.header;
    const timestamp = await api.query.timestamp.now.at(blockHash);
    const events = await api.query.system.events.at(blockHash);

    console.log(`🧱 Block #${i} (${new Date(timestamp.toNumber()).toUTCString()})`);
    console.log(`  Hash        : ${blockHash.toHex()}`);
    console.log(`  Parent Hash : ${header.parentHash.toHex()}`);
    console.log(`  Extrinsics  : ${block.block.extrinsics.length}`);
    console.log(`  Events      : ${events.length}`);

    block.block.extrinsics.forEach((ex, idx) => {
      const method = `${ex.method.section}.${ex.method.method}`;
      const signer = ex.isSigned ? ex.signer.toString() : 'Unsigned';
      console.log(`    - [${idx}] ${method} by ${signer}`);
    });

    console.log('------------------------------------------------------------\n');
  }

  await api.disconnect();
  console.log("✅ Done.");
}

main().catch(console.error);
