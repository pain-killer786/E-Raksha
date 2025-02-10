const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const apiKey = "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";  // Replace with your OpenAI API key

//Load Chat history when page loads 
document.addEventListener("DOMContentLoaded", loadChatHistory);

// Initial message
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    // Display user message
    displayMessage(message, "user");
    userInput.value = "";

    // Show "Typing..." effect
    displayMessage("Typing...", "bot", true);

    // Call OpenAI API
    const response = await fetchGeminiResponse(message);

    // Remove "Typing..." effect
    chatBox.lastElementChild.remove();

    // Display bot response
    displayMessage(response, "bot");
    saveChatHistory(response, "bot");
}

function displayMessage(text, sender, isTemporary = false) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", sender);
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Remove temporary messages (Typing effect)
    if (isTemporary) {
        messageElement.setAttribute("id", "typing-message");
    }
}

//Fuction to save chat history in local storage
function saveChatHistory(message, sender) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ message, sender });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

//Function to load chat history from local storage
function loadChatHistory() {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach(({ message, sender }) => {
        displayMessage(message, sender);
    });
}




async function fetchGeminiResponse(userMessage) {
    try {
        const response = await fetch("http://localhost:5500/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ message: userMessage })
            });

        const data = await response.json();
        return data.response || "Error: No response from server.";
    } catch (error) {
        console.error("Fetch API Error:", error);
        return "Oops! Something went wrong.";
    }
}


const darkModeToggle = document.getElementById("dark-mode-toggle");

// Check Local Storage for Dark Mode Preference
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️ Light Mode";
}

// Toggle Dark Mode
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Store User Preference
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        darkModeToggle.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("darkMode", "disabled");
        darkModeToggle.textContent = "🌙 Dark Mode";
    }
});


// Send message on Enter key press
userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
