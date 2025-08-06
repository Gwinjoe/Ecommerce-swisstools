import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const socket = io();

gsap.registerPlugin(ScrollTrigger);

// Sample chat data (replace with actual data from backend)
const chats = [
  {
    id: 1,
    contact: "Support Team",
    avatar: "assets/images/team1.jpeg",
    status: "Online",
    messages: [
      { id: 1, text: "Hello! How can we assist you today?", sender: "support", time: "10:30 AM", read: true },
      { id: 2, text: "I have an issue with my order #1234.", sender: "user", time: "10:32 AM", read: true },
      { id: 3, text: "Can you provide more details about the issue?", sender: "support", time: "10:35 AM", read: true }
    ]
  },
  {
    id: 2,
    contact: "Support Team",
    avatar: "assets/images/team1.jpeg",
    status: "Offline",
    messages: [
      { id: 1, text: "I need help with a product return.", sender: "user", time: "Yesterday", read: true },
      { id: 2, text: "Please provide the order number.", sender: "support", time: "Yesterday", read: true }
    ]
  }
];

const menuToggle = document.querySelector(".menu-toggle");
const headerExtras = document.querySelector(".header-extras");
const themeToggleBtn = document.querySelector(".theme-toggle-btn");
const languageToggle = document.querySelector(".language-toggle");
const languageSelector = document.querySelector(".language-selector");
const notificationBtn = document.querySelector(".notification-btn");
const settingsBtn = document.querySelector(".settings-btn");
const userProfile = document.querySelector(".user-profile");
const scrollTopBtn = document.querySelector(".scroll-top-btn");
const yearSpan = document.querySelector(".year");
const newsletterForm = document.querySelector(".footer-newsletter");
const chatList = document.querySelector(".chat-list");
const chatMessages = document.querySelector(".chat-messages");
const messageInput = document.querySelector(".message-input");
const sendBtn = document.querySelector(".send-btn");
const newChatBtn = document.querySelector(".new-chat-btn");
const chatSearch = document.querySelector(".chat-search input");
const chatSidebar = document.querySelector(".chat-sidebar");
const chatContact = document.querySelector(".chat-contact");

// Set current year in footer
yearSpan.textContent = new Date().getFullYear();

// Header Animations
gsap.from(".sticky-header", {
  y: -100,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  delay: 0.2
});

gsap.from(".logo", {
  x: -50,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  delay: 0.4
});

gsap.from(".header-extras > *", {
  x: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "power2.out",
  delay: 0.6
});

// Footer Animations
gsap.from(".footer-column", {
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".site-footer",
    start: "top 80%",
    toggleActions: "play none none none"
  }
});

gsap.from(".footer-bottom", {
  y: 20,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".footer-bottom",
    start: "top 90%",
    toggleActions: "play none none none"
  }
});

// Scroll to Top Button
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

ScrollTrigger.create({
  trigger: document.body,
  start: "top -200",
  end: "bottom bottom",
  onUpdate: (self) => {
    scrollTopBtn.classList.toggle("active", self.progress > 0.1);
  }
});

// Menu Toggle
menuToggle.addEventListener("click", () => {
  headerExtras.classList.toggle("active");
  chatSidebar.classList.toggle("active");
  gsap.to(headerExtras, {
    height: headerExtras.classList.contains("active") ? "auto" : 0,
    opacity: headerExtras.classList.contains("active") ? 1 : 0,
    duration: 0.3,
    ease: "power2.out"
  });
  gsap.to(chatSidebar, {
    left: chatSidebar.classList.contains("active") ? "0" : "-100%",
    duration: 0.3,
    ease: "power2.out"
  });
});

// Theme Toggle
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggleBtn.querySelector("i").classList.toggle("fa-moon", !isDark);
  themeToggleBtn.querySelector("i").classList.toggle("fa-sun", isDark);
  document.documentElement.style.setProperty("--background-color", isDark ? "#1c1c1c" : "#e5e5e5");
  document.documentElement.style.setProperty("--card-bg", isDark ? "#2c2c2c" : "#fff");
  document.documentElement.style.setProperty("--text-color", isDark ? "#ccc" : "#333");
  document.documentElement.style.setProperty("--chat-bg", isDark ? "#1c2526" : "#ece5dd");
  document.documentElement.style.setProperty("--sent-message-bg", isDark ? "#005c4b" : "#dcf8c6");
  document.documentElement.style.setProperty("--received-message-bg", isDark ? "#2c2c2c" : "#fff");
});

// Language Selector
languageToggle.addEventListener("click", () => {
  languageSelector.classList.toggle("active");
});

document.querySelectorAll(".language-options li").forEach(item => {
  item.addEventListener("click", () => {
    const lang = item.getAttribute("data-lang");
    console.log(`Language selected: ${lang}`); // Replace with actual language switch logic
    languageSelector.classList.remove("active");
  });
});

// Profile Dropdown
userProfile.addEventListener("click", () => {
  userProfile.classList.toggle("active");
});

// Notification Button
notificationBtn.addEventListener("click", () => {
  console.log("Notifications opened"); // Replace with actual notification logic
});

// Settings Button
settingsBtn.addEventListener("click", () => {
  console.log("Settings opened"); // Replace with actual settings logic
});

// Newsletter Subscription
newsletterForm.querySelector("button").addEventListener("click", () => {
  const email = newsletterForm.querySelector("input").value;
  if (email) {
    console.log(`Subscribed with email: ${email}`); // Replace with actual subscription logic
    newsletterForm.querySelector("input").value = "";
  }
});

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
  if (!languageSelector.contains(e.target) && !languageToggle.contains(e.target)) {
    languageSelector.classList.remove("active");
  }
  if (!userProfile.contains(e.target)) {
    userProfile.classList.remove("active");
  }
});

// Render Chat Threads
function renderChatThreads(data) {
  try {
    chatList.innerHTML = "";
    data.forEach(chat => {
      const thread = document.createElement("div");
      thread.classList.add("chat-thread");
      thread.setAttribute("data-id", chat.id);
      thread.innerHTML = `
                <img src="${chat.avatar}" alt="${chat.contact}">
                <div class="chat-thread-info">
                    <span class="chat-thread-name">${chat.contact}</span>
                    <span class="chat-thread-preview">${chat.messages[chat.messages.length - 1].text}</span>
                </div>
                <span class="chat-thread-time">${chat.messages[chat.messages.length - 1].time}</span>
            `;
      chatList.appendChild(thread);
    });

    gsap.from(".chat-thread", {
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 0.3,
      ease: "power2.out"
    });
  } catch (error) {
    console.error("Error rendering chat threads:", error);
  }
}

// Render Messages
function renderMessages(chatId) {
  try {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) {
      chatMessages.innerHTML = "<p>Select a chat to view messages.</p>";
      return;
    }

    chatContact.querySelector(".contact-name").textContent = chat.contact;
    chatContact.querySelector(".contact-status").textContent = chat.status;
    chatContact.querySelector(".contact-img").src = chat.avatar;

    chatMessages.innerHTML = "";
    chat.messages.forEach(message => {
      const messageEl = document.createElement("div");
      messageEl.classList.add("message", message.sender === "user" ? "sent" : "received");
      messageEl.innerHTML = `
                <p>${message.text}</p>
                <span class="message-time">${message.time}</span>
                ${message.sender === "user" ? '<span class="message-ticks fas fa-check-double"></span>' : ""}
            `;
      chatMessages.appendChild(messageEl);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;

    gsap.from(".message", {
      opacity: 0,
      y: 10,
      stagger: 0.1,
      duration: 0.3,
      ease: "power2.out"
    });
  } catch (error) {
    console.error("Error rendering messages:", error);
  }
}

// Handle Chat Thread Click
chatList.addEventListener("click", (e) => {
  const thread = e.target.closest(".chat-thread");
  if (thread) {
    document.querySelectorAll(".chat-thread").forEach(t => t.classList.remove("active"));
    thread.classList.add("active");
    const chatId = parseInt(thread.getAttribute("data-id"));
    renderMessages(chatId);
    if (window.innerWidth <= 768) {
      chatSidebar.classList.remove("active");
      gsap.to(chatSidebar, {
        left: "-100%",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }
});

// Handle Message Sending
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  try {
    const text = messageInput.value.trim();
    if (!text) return;

    const activeThread = document.querySelector(".chat-thread.active");
    if (!activeThread) {
      console.log("No chat selected");
      return;
    }

    const chatId = parseInt(activeThread.getAttribute("data-id"));
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      const newMessage = {
        id: chat.messages.length + 1,
        text,
        sender: "user",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: true
      };
      chat.messages.push(newMessage);
      console.log(`Message sent to chat ${chatId}: ${text}`); // Replace with AJAX/WebSocket
      renderMessages(chatId);
      renderChatThreads(chats); // Update thread preview
      messageInput.value = "";
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// New Chat Button
newChatBtn.addEventListener("click", () => {
  console.log("Starting new chat"); // Replace with logic to initiate new chat
});

// Chat Search
chatSearch.addEventListener("input", () => {
  try {
    const value = chatSearch.value.toLowerCase();
    const filtered = chats.filter(c => c.contact.toLowerCase().includes(value));
    renderChatThreads(filtered);
  } catch (error) {
    console.error("Error searching chats:", error);
  }
});

// Initial Render
renderChatThreads(chats);
if (chats.length > 0) {
  document.querySelector(".chat-thread").classList.add("active");
  renderMessages(1);
}
