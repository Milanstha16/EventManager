document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     PAGE DETECTION (WORKS ON VERCEL + LOCAL)
  ========================== */

  const path = window.location.pathname.toLowerCase();

  const isLoginPage =
    path.endsWith("/login") ||
    path.endsWith("/login.html");

  const isRegisterPage =
    path.endsWith("/register") ||
    path.endsWith("/register.html");

  const isDashboardPage =
    path.endsWith("/dashboard") ||
    path.endsWith("/dashboard.html");

  const isProfilePage =
    path.endsWith("/profile") ||
    path.endsWith("/profile.html");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  /* =========================
     AUTO SESSION CHECK
  ========================== */

  // Redirect logged-in users away from login/register
  if (currentUser && (isLoginPage || isRegisterPage)) {
    redirectUser(currentUser.role);
  }

  // Protect dashboard & profile
  if (!currentUser && (isDashboardPage || isProfilePage)) {
    window.location.href = "/login.html";
  }

  /* =========================
     REGISTER SYSTEM
  ========================== */

  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = document.getElementById("password").value.trim();
      const role = document.getElementById("role").value;
      const errorElement = document.getElementById("registerError");

      errorElement.textContent = "";

      if (name.length < 3) {
        errorElement.textContent = "Name must be at least 3 characters.";
        return;
      }

      if (!validateEmail(email)) {
        errorElement.textContent = "Invalid email format.";
        return;
      }

      if (password.length < 6) {
        errorElement.textContent = "Password must be at least 6 characters.";
        return;
      }

      if (!role) {
        errorElement.textContent = "Please select a role.";
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];

      const emailExists = users.some(user => user.email === email);

      if (emailExists) {
        errorElement.textContent = "Email already registered.";
        return;
      }

      const newUser = {
        id: Date.now(),
        name,
        email,
        password: hashPassword(password),
        role
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      alert("Registration successful! Please login.");
      registerForm.reset();
      window.location.href = "/login.html";
    });
  }

  /* =========================
     LOGIN SYSTEM
  ========================== */

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim().toLowerCase();
      const password = document.getElementById("loginPassword").value.trim();
      const errorElement = document.getElementById("loginError");

      errorElement.textContent = "";

      let users = JSON.parse(localStorage.getItem("users")) || [];

      const user = users.find(
        user =>
          user.email === email &&
          user.password === hashPassword(password)
      );

      if (!user) {
        errorElement.textContent = "Invalid email or password.";
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));

      alert("Login successful!");
      redirectUser(user.role);
    });
  }

  /* =========================
     LOGOUT SYSTEM
  ========================== */

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      window.location.href = "/login.html";
    });
  }

  /* =========================
     PROFILE MANAGEMENT
  ========================== */

  const profileForm = document.getElementById("profileForm");

  if (profileForm) {
    if (!currentUser) {
      window.location.href = "/login.html";
      return;
    }

    const nameInput = document.getElementById("profileName");
    const emailInput = document.getElementById("profileEmail");
    const passwordInput = document.getElementById("profilePassword");
    const errorElement = document.getElementById("profileError");

    nameInput.value = currentUser.name;
    emailInput.value = currentUser.email;

    profileForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const newName = nameInput.value.trim();
      const newEmail = emailInput.value.trim().toLowerCase();
      const newPassword = passwordInput.value.trim();

      errorElement.textContent = "";

      if (newName.length < 3) {
        errorElement.textContent = "Name must be at least 3 characters.";
        return;
      }

      if (!validateEmail(newEmail)) {
        errorElement.textContent = "Invalid email format.";
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];

      const emailExists = users.some(user =>
        user.email === newEmail && user.id !== currentUser.id
      );

      if (emailExists) {
        errorElement.textContent = "Email already in use.";
        return;
      }

      const userIndex = users.findIndex(user => user.id === currentUser.id);

      users[userIndex].name = newName;
      users[userIndex].email = newEmail;

      if (newPassword) {
        if (newPassword.length < 6) {
          errorElement.textContent = "Password must be at least 6 characters.";
          return;
        }
        users[userIndex].password = hashPassword(newPassword);
      }

      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));

      alert("Profile updated successfully!");
      window.location.href = "/dashboard.html";
    });
  }

});

/* =========================
   HELPER FUNCTIONS
========================== */

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function hashPassword(password) {
  return btoa(password); // Demo only
}

function redirectUser(role) {
  window.location.href = "/dashboard.html";
}
