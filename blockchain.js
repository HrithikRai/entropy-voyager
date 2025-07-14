const { ApiPromise, WsProvider } = require('@polkadot/api');

let api;

async function getAPI() {
  if (!api) {
    const provider = new WsProvider('wss://testnet.entropy.xyz');
    api = await ApiPromise.create({ provider });
  }
  return api;
}

async function fetchBlockDetails(blockHashOrLatest) {
  const api = await getAPI();

  const hash = blockHashOrLatest === 'latest'
    ? await api.rpc.chain.getFinalizedHead()
    : blockHashOrLatest;

  const [signedBlock, events, chain, nodeName, nodeVersion, genesisHash, runtimeVersion, health] =
    await Promise.all([
      api.rpc.chain.getBlock(hash),
      api.query.system.events.at(hash),
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
      api.genesisHash.toHex(),
      api.runtimeVersion,
      api.rpc.system.health()
    ]);

  // dummy address for MVP
  const address = '0xf595152f957e7c4e459d37ed75eabc2ec60e6e0b8a93785976173b0db3f7df9c';
  const { data: balanceData } = await api.query.system.account(address);

  const formattedEvents = events.map(({ event, phase }) => ({
    section: event.section,
    method: event.method,
    documentation: event.meta?.documentation?.toArray()?.join(' '),
    data: event.data.toHuman(),
    phase: phase.toJSON()
  }));

  return {
    chain: chain.toString(),
    nodeName: nodeName.toString(),
    nodeVersion: nodeVersion.toString(),
    genesisHash: genesisHash.toString(),
    runtimeVersion: runtimeVersion.specVersion.toString(),
    blockNumber: signedBlock.block.header.number.toNumber(),
    hash: hash.toHex ? hash.toHex() : hash,
    extrinsics: signedBlock.block.extrinsics.map((ext) => ext.toHuman()),
    events: formattedEvents,
    health: health.toJSON(),
    balance: {
      address,
      free: balanceData.free.toString(),
      reserved: balanceData.reserved.toString(),
      miscFrozen: balanceData.miscFrozen?.toString(),
      feeFrozen: balanceData.feeFrozen?.toString()
    }
  };
}

module.exports = { fetchBlockDetails };
