const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

const { CohereClientV2 } = require('cohere-ai');

require('dotenv').config();
const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

async function askLLMChat(question, blockData) {
  const response = await cohere.chat({
    model: 'command-a-03-2025',
    messages: [
      { role: 'system', content: 'You are a blockchain analyst assistant. Help the user understand what happened in the given block.' },
      { role: 'user', content: `Here is the block data: ${JSON.stringify(blockData)}` },
      { role: 'user', content: question },
    ],
  });

  return response.message.content[0].text || 'No response from model.';

}

module.exports = { askLLMChat };
