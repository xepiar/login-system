const API_URL = "https://login-system-1dht.onrender.com";

// --- DOM ELEMENTS & SECTION TOGGLING ---
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const showSignUp = document.getElementById("showSignUp");
const showLogin = document.getElementById("showLogin");

if (showSignUp) {
  showSignUp.addEventListener("click", (e) => {
    e.preventDefault();
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
  });
}

if (showLogin) {
  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
  });
}

// --- REGISTER FORM HANDLER ---
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const registerMessage = document.getElementById("registerMessage");

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! Please log in.");
      
      // Clear form inputs
      registerForm.reset();
      if (registerMessage) registerMessage.textContent = "";

      // Switch view back to Login section
      registerSection.classList.add("hidden");
      loginSection.classList.remove("hidden");
    } catch (err) {
      if (registerMessage) {
        registerMessage.textContent = err.message;
        registerMessage.style.color = "red";
      } else {
        alert(err.message);
      }
    }
  });
}

// --- LOGIN FORM HANDLER ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "dashboard.html";
    } catch (err) {
      if (message) {
        message.textContent = err.message;
        message.style.color = "red";
      } else {
        alert(err.message);
      }
    }
  });
}