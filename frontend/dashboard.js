// dashboard.js

const API_URL = "https://domingo-9wja.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "front.html";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("userInfo").textContent = `Welcome, ${data.user.name}! (${data.user.email})`;
    } else {
      localStorage.removeItem("token");
      window.location.href = "front.html";
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "front.html";
}