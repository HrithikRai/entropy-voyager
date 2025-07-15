const promptInput = document.getElementById("prompt");
const submitButton = document.getElementById("submit");
const chatContainer = document.getElementById("chatContainer");

// Scroll to bottom helper
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Append a message to chat container
function addMessage(message, sender) {
    const msg = document.createElement("div");
    msg.classList.add("chat-message", sender); // sender = "user" or "ai"
    msg.textContent = message;
    chatContainer.appendChild(msg);
    scrollToBottom();
}

// Speak out the AI's response (optional)
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

// Send the user message to the server
function sendMessageToChatbot(message) {
    fetch("https://myclone-production.up.railway.app/clone_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message })
    })
    .then(res => res.json())
    .then(data => {
        const response = data?.response || "Sorry, I couldn't understand that.";
        addMessage(response, "ai");
        //speak(response);
    })
    .catch(() => {
        addMessage("Network error. Please try again.", "ai");
    });
}

// Send on click
submitButton.addEventListener("click", () => {
    const message = promptInput.value.trim();
    if (message) {
        addMessage(message, "user");
        sendMessageToChatbot(message);
        promptInput.value = "";
    }
});

// Send on Enter
promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitButton.click();
});
