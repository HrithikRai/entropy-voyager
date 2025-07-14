const { CohereClientV2 } = require('cohere-ai');

// ✅ Replace with your real API key
const cohere = new CohereClientV2({
  token: 'cZWxyHPX5B72hYVgeLK45bTrwiM05v8lQ5dHGIXS',
});

async function testLLM() {
  try {
    const response = await cohere.chat({
      model: 'command-a-03-2025',
      messages: [
        {
          role: 'user',
          content: 'Summarize what a blockchain is in one sentence.',
        },
      ],
    });

    console.log('✅ LLM Response:\n', response.message.content[0].text);
  } catch (err) {
    console.error('❌ Error from Cohere:', err.message || err);
  }
}

testLLM();
