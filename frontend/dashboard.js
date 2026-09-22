// dashboard.js

const API_URL = "https://login-system-ldht.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const logoutBtn = document.getElementById("logoutBtn");

  // 1. Redirect immediately if no token is found
  if (!token) {
    window.location.href = "front.html";
    return;
  }

  // 2. Fetch user profile using bearer token
  try {
    const response = await fetch(`${API_URL}/api/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("userInfo").innerHTML = 
        `<strong>Name:</strong> ${data.user.name}<br><strong>Email:</strong> ${data.user.email}`;
    } else {
      // Clear token and kick back to front page if session is invalid or expired
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "front.html";
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "front.html";
  }

  // 3. Attach logout listener safely
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});

// Logout function
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "front.html";
}