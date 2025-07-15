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

// renderer.js

function showStatusMessage(message, isLoading = true, autoRemove = true, duration = 3000) {
  let statusDiv = document.getElementById("statusMessage");

  if (!statusDiv) {
    statusDiv = document.createElement("div");
    statusDiv.id = "statusMessage";
    statusDiv.style.position = "fixed";
    statusDiv.style.top = "20px";
    statusDiv.style.right = "20px";
    statusDiv.style.background = "#1a1a1a";
    statusDiv.style.border = "2px solid #00ffaa";
    statusDiv.style.padding = "10px 20px";
    statusDiv.style.borderRadius = "10px";
    statusDiv.style.boxShadow = "0 0 10px #00ffaa88";
    statusDiv.style.color = "#00ffaa";
    statusDiv.style.fontFamily = "Courier New";
    statusDiv.style.zIndex = "10000";
    document.body.appendChild(statusDiv);
  }

  statusDiv.innerHTML = isLoading ? `⏳ ${message}` : `✅ ${message}`;

  if (autoRemove) {
    setTimeout(() => {
      if (statusDiv) statusDiv.remove();
    }, duration);
  }
}

async function loadGraph() {
  showStatusMessage("Fetching blocks...", true); // Show loading

  const countInput = document.getElementById("blockCountInput");
  const count = countInput ? parseInt(countInput.value) : 10;

  const blocks = await window.entropyAPI.fetchBlocks(count);

  if (!blocks || blocks.length === 0) {
    showStatusMessage("Failed to load blocks", false);
    alert("❌ Failed to load blocks.");
    return;
  }

  showStatusMessage(`Fetched ${blocks.length} blocks successfully`, false);

  // ...rest of your graph rendering logic (same as before)...
  const nodes = [], edges = [];

  blocks.forEach((block, i) => {
    nodes.push({
      id: block.number,
      label: `🧱 ${block.number}`,
      title: `Hash: ${block.hash}\nAuthor: ${block.author}`,
      shape: "circle",
      size: 40,
      font: {
        color: "#000",
        size: 20,
        face: "Courier New",
        bold: true
      },
      color: {
        background: "#00ffaa",
        border: "#fff",
        highlight: {
          background: "#ffaa00",
          border: "#fff"
        }
      }
    });

    if (i < blocks.length - 1) {
      edges.push({
        from: blocks[i + 1].number,
        to: block.number,
        arrows: "to",
        color: "#888",
        smooth: { type: "dynamic", roundness: 0.4 }
      });
    }
  });

  const container = document.getElementById("network");
  const data = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  };

  const options = {
    layout: { improvedLayout: true },
    interaction: {
      hover: true,
      dragNodes: true,
      dragView: true,
      zoomView: true,
      tooltipDelay: 100
    },
    physics: {
      enabled: true,
      solver: "barnesHut",
      barnesHut: {
        gravitationalConstant: -8000,
        springLength: 200,
        springConstant: 0.05,
        damping: 0.09
      },
      stabilization: {
        enabled: true,
        iterations: 150,
        updateInterval: 25
      }
    },
    nodes: { borderWidth: 2, shadow: true },
    edges: {
      width: 2,
      shadow: true,
      arrows: { to: { enabled: true, scaleFactor: 1 } }
    }
  };

  const network = new vis.Network(container, data, options);

  network.on("selectNode", function (params) {
    if (params.nodes && params.nodes.length > 0) {
      const selectedNodeId = params.nodes[0];
      showNodeOptions(selectedNodeId);
    }
  });

  setTimeout(() => {
    network.fit({
      animation: {
        duration: 1000,
        easingFunction: "easeInOutQuad"
      }
    });
  }, 1000);
}



function showNodeOptions(nodeId) {
  // Create a modal for node options if it doesn't exist
  let modal = document.getElementById("nodeModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "nodeModal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "#1a1a1a";
    modal.style.border = "2px solid #00ffaa";
    modal.style.padding = "20px";
    modal.style.zIndex = "1000";
    modal.style.borderRadius = "10px";
    modal.style.boxShadow = "0 0 15px #00ffaa";
    document.body.appendChild(modal);
  }
  // Clear previous content and add new buttons for options
  modal.innerHTML = `
    <h3>Options for Block ${nodeId}</h3>
    <button onclick="getBlockDetails(${nodeId})">Get Details</button>
    <button onclick="detectAnomaly(${nodeId})">Detect Anomaly</button>
    <button onclick="closeModal()">Close</button>
  `;
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("nodeModal");
  if (modal) modal.style.display = "none";
}
async function getBlockDetails(nodeId) {
  displayChatResponse(null, true); // Show loading
  const question = `Provide detailed analysis for block ${nodeId}.`;
  const response = await window.entropyAPI.askLLM(question, nodeId);
  displayChatResponse(response);   // Show final result
  closeModal();
}

async function detectAnomaly(nodeId) {
  displayChatResponse(null, true); // Show loading
  const question = `Analyze block ${nodeId} and report if there are any anomalies or unusual patterns.`;
  const response = await window.entropyAPI.askLLM(question, nodeId);
  displayChatResponse(response);   // Show final result
  closeModal();
}

function displayChatResponse(responseText = null, loading = false) {
  let chatDiv = document.getElementById("chatResponse");

  if (!chatDiv) {
    chatDiv = document.createElement("div");
    chatDiv.id = "chatResponse";
    chatDiv.style.position = "fixed";
    chatDiv.style.bottom = "20px";
    chatDiv.style.right = "20px";
    chatDiv.style.background = "#1a1a1a";
    chatDiv.style.border = "2px solid #00ffaa";
    chatDiv.style.padding = "20px";
    chatDiv.style.borderRadius = "10px";
    chatDiv.style.boxShadow = "0 0 15px #00ffaa";
    chatDiv.style.maxWidth = "350px";
    chatDiv.style.maxHeight = "400px";
    chatDiv.style.overflowY = "auto";
    chatDiv.style.zIndex = "9999";
    document.body.appendChild(chatDiv);
  }

  // Show loading or result
  if (loading) {
    chatDiv.innerHTML = `
      <h3 style="margin-top:0;">🧠 Analysing...</h3>
      <p>⏳ Please wait while the AI reviews this block...</p>
    `;
  } else {
    chatDiv.innerHTML = `
      <h3 style="margin-top:0;">🧠 Analysis</h3>
      <p style="white-space: pre-wrap;">${responseText}</p>
      <button onclick="closeChatResponse()" style="margin-top:10px; padding:5px 10px; background:#00ffaa; border:none; cursor:pointer;">Close</button>
    `;
  }
}


function closeChatResponse() {
  const chatDiv = document.getElementById("chatResponse");
  if (chatDiv) chatDiv.remove();
}

