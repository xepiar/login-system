
const API_URL = "https://login-system-1dht.onrender.com";

// DOM Elements
const loginSection = document.getElementById("loginSection");
const registerForm = document.getElementById("registerForm");
const showRegisterLink = document.getElementById("showRegister");
const showLoginLink = document.getElementById("showLogin");

const loginForm = document.getElementById("loginForm");
const messageEl = document.getElementById("message");
const registerMessageEl = document.getElementById("registerMessage");

// Switch to Register Form
showRegisterLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginSection.classList.add("hidden");
  registerForm.classList.remove("hidden");
});

// Switch back to Login Form
if (showLoginLink) {
  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.classList.add("hidden");
    loginSection.classList.remove("hidden");
  });
}

// Handle Registration
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  registerMessageEl.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed.");
    }

    registerMessageEl.style.color = "green";
    registerMessageEl.textContent = "Registration successful! Redirecting to login...";
    
    // Auto switch to login form after 1.5 seconds
    setTimeout(() => {
      registerForm.reset();
      registerMessageEl.textContent = "";
      registerForm.classList.add("hidden");
      loginSection.classList.remove("hidden");
    }, 1500);

  } catch (error) {
    registerMessageEl.style.color = "red";
    registerMessageEl.textContent = error.message;
  }
});

// Handle Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageEl.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed.");
    }

    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } catch (error) {
    messageEl.style.color = "red";
    messageEl.textContent = error.message;
  }
});

