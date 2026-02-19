document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     PAGE DETECTION (VERCEL SAFE)
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

  // If logged in and on login/register → redirect to dashboard
  if (currentUser && (isLoginPage || isRegisterPage)) {
    window.location.href = "/dashboard.html";
  }

  // If NOT logged in and trying to access protected page
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

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");
      const errorElement = document.getElementById("registerError");

      if (!nameInput || !emailInput || !passwordInput) {
        console.error("Register form inputs missing in HTML.");
        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value.trim();

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
        password: hashPassword(password)
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

      const emailInput = document.getElementById("loginEmail");
      const passwordInput = document.getElementById("loginPassword");
      const errorElement = document.getElementById("loginError");

      if (!emailInput || !passwordInput) {
        console.error("Login form inputs missing in HTML.");
        return;
      }

      const email = emailInput.value.trim().toLowerCase();
      const password = passwordInput.value.trim();

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
      window.location.href = "/dashboard.html";
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

    if (!nameInput || !emailInput) {
      console.error("Profile inputs missing in HTML.");
      return;
    }

    nameInput.value = currentUser.name;
    emailInput.value = currentUser.email;

    profileForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const newName = nameInput.value.trim();
      const newEmail = emailInput.value.trim().toLowerCase();
      const newPassword = passwordInput ? passwordInput.value.trim() : "";

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
  return btoa(password); // Demo only (not secure)
}
