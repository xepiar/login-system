const API_URL = "https://login-system-ldht.onrender.com";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");

if (showRegister) {
  showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.classList.toggle("hidden");
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
      } else {
        message.textContent = data.message;
      }
    } catch (err) {
      message.textContent = "Server error. Please try again.";
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const registerMessage = document.getElementById("registerMessage");

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      registerMessage.textContent = data.message;
      if (res.ok) registerForm.reset();
    } catch (err) {
      registerMessage.textContent = "Server error. Please try again.";
    }
  });
}