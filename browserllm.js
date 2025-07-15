// llm.js
const { CohereClientV2 } = require('cohere-ai');

const cohere = new CohereClientV2({
  token: "cZWxyHPX5B72hYVgeLK45bTrwiM05v8lQ5dHGIXS",
});

async function askLLM(question, blockData) {
  const response = await cohere.chat({
    model: 'command-a-03-2025',
    messages: [
      { 
        role: 'system', 
        content: 'You are a blockchain analyst assistant. Help the user understand what happened in the given block. Provide details and detect anomalies if possible.' 
      },
      { role: 'user', content: `Block data: ${JSON.stringify(blockData)}` },
      { role: 'user', content: question },
    ],
  });
  return response.message.content[0].text || 'No response from model.';
}

module.exports = { askLLM };
