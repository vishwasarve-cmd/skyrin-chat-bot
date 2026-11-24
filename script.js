const messagesEl = document.getElementById("messages");
const inputEl = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const charCount = document.getElementById("charCount");
const suggestionsEl = document.getElementById("suggestions");
const clearButton = document.getElementById("clearChat");

let history = [];
let busy = false;

document.getElementById("year").textContent = new Date().getFullYear();

function addMessage(role, text) {
  const row = document.createElement("div");
  row.className = `message-row ${role === "user" ? "user-row" : "bot-row"}`;
  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = role === "user" ? "Y" : "S";
  const content = document.createElement("div");
  content.className = "message-content";
  const name = document.createElement("div");
  name.className = "message-name";
  name.textContent = role === "user" ? "YOU" : "SKYRIN AI";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  // textContent prevents model output from being interpreted as HTML.
  bubble.textContent = text;
  content.append(name, bubble);
  row.append(avatar, content);
  messagesEl.appendChild(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return row;
}

function showTyping() {
  const row = document.createElement("div");
  row.className = "message-row bot-row";
  row.id = "typingRow";
  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = "S";
  const content = document.createElement("div");
  content.className = "message-content";
  const name = document.createElement("div");
  name.className = "message-name";
  name.textContent = "SKYRIN AI IS THINKING";
  const dots = document.createElement("div");
  dots.className = "bubble typing";
  dots.innerHTML = "<i></i><i></i><i></i>";
  content.append(name, dots);
  row.append(avatar, content);
  messagesEl.appendChild(row);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
function removeTyping() { document.getElementById("typingRow")?.remove(); }

async function sendMessage(text) {
  const message = text.trim();
  if (!message || busy) return;
  if (message.length > 1200) return;

  busy = true;
  sendButton.disabled = true;
  suggestionsEl?.remove();
  addMessage("user", message);
  history.push({ role: "user", text: message });
  inputEl.value = "";
  resizeInput();
  charCount.textContent = "0 / 1200";
  showTyping();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: history.slice(-10, -1) })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    const reply = data.reply || "I couldn't prepare a response. Please try again.";
    removeTyping();
    addMessage("bot", reply);
    history.push({ role: "model", text: reply });
    history = history.slice(-12);
  } catch (error) {
    removeTyping();
    addMessage("bot", `Sorry, I couldn't connect right now. ${error.message} Please try again in a moment or contact Skyrin Engineering directly.`);
    history.pop();
  } finally {
    busy = false;
    sendButton.disabled = false;
    inputEl.focus();
  }
}

function resizeInput() {
  inputEl.style.height = "auto";
  inputEl.style.height = `${Math.min(inputEl.scrollHeight, 110)}px`;
}
inputEl.addEventListener("input", () => {
  resizeInput();
  charCount.textContent = `${inputEl.value.length} / 1200`;
});
inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage(inputEl.value);
  }
});
sendButton.addEventListener("click", () => sendMessage(inputEl.value));
document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => sendMessage(button.dataset.prompt || ""));
});
clearButton.addEventListener("click", () => {
  history = [];
  messagesEl.innerHTML = "";
  const welcome = document.createElement("div");
  welcome.className = "message-row bot-row";
  welcome.innerHTML = '<div class="message-avatar">S</div><div class="message-content"><div class="message-name">SKYRIN AI</div><div class="bubble">Hello again! What would you like to know about Skyrin Engineering?</div></div>';
  messagesEl.appendChild(welcome);
  const suggestions = document.createElement("div");
  suggestions.className = "suggestions";
  suggestions.innerHTML = `
    <button class="suggestion" data-prompt="What services does Skyrin Engineering provide?">Explore our services <span>↗</span></button>
    <button class="suggestion" data-prompt="Tell me about your BIM services.">BIM services <span>↗</span></button>
    <button class="suggestion" data-prompt="How can I request a project quotation?">Request a quotation <span>↗</span></button>
    <button class="suggestion" data-prompt="How can I contact Skyrin Engineering?">Contact information <span>↗</span></button>`;
  messagesEl.appendChild(suggestions);
  suggestions.querySelectorAll(".suggestion").forEach(button => button.addEventListener("click", () => sendMessage(button.dataset.prompt || "")));
});
