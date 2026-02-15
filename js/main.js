document.addEventListener("DOMContentLoaded", () => {
  const authLinks = document.getElementById("authLinks");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (authLinks) {
    if (currentUser) {
      authLinks.innerHTML = `
        <a href="profile.html">Profile</a>
        <a href="#" id="logoutBtn">Logout</a>
      `;

      document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
      });

    } else {
      authLinks.innerHTML = `
        <a href="login.html">Login</a>
        <a href="register.html">Register</a>
      `;
    }
  }
});
