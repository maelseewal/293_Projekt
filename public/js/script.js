const login = document.querySelector(".login");
const mainContainer = document.querySelector(".main-container");
let isLoggedIn = false;
const LOGIN_DURATION = 2 * 60 * 60 * 1000;

function showLogin() {
  login.style.display = "flex";
  mainContainer.style.display = "none";
}

function showMainContent() {
  login.style.display = "none";
  mainContainer.style.display = "block";
}

// Prüfe ob Login noch gültig ist
function isLoginValid() {
  try {
    const loginTime = localStorage.getItem("loginTime");
    if (!loginTime) return false;

    const currentTime = new Date().getTime();
    const timeDifference = currentTime - parseInt(loginTime);

    return timeDifference < LOGIN_DURATION;
  } catch (error) {
    return false;
  }
}

// Lösche abgelaufene Login-Daten
function clearExpiredLogin() {
  try {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("loginTime");
  } catch (error) {
    console.log("Fehler beim Löschen der Login-Daten");
  }
}

// Setze Login mit Timestamp
function setLogin() {
  try {
    const currentTime = new Date().getTime();
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("loginTime", currentTime.toString());
    console.log("Login gesetzt für:", new Date(currentTime).toLocaleString());
  } catch (error) {
    console.log("localStorage nicht verfügbar");
  }
}

// Beim Laden der Seite
window.onload = function () {
  try {
    if (localStorage.getItem("loggedIn") === "true" && isLoginValid()) {
      isLoggedIn = true;
      showMainContent();

      // Zeige verbleibende Zeit in der Konsole
      const loginTime = parseInt(localStorage.getItem("loginTime"));
      const remainingTime = LOGIN_DURATION - (new Date().getTime() - loginTime);
      const remainingMinutes = Math.floor(remainingTime / (1000 * 60));
      console.log(`Login noch gültig für ${remainingMinutes} Minuten`);
    } else {
      // Login abgelaufen oder nicht vorhanden
      if (localStorage.getItem("loggedIn") === "true") {
        console.log("Login abgelaufen - bitte neu anmelden");
        clearExpiredLogin();
      }
      showLogin();
    }
  } catch (error) {
    console.log(
      "localStorage nicht verfügbar, verwende Session-basierte Lösung"
    );
    showLogin();
  }
};

// Login Form Handler
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  isLoggedIn = true;
  setLogin();
  showMainContent();
});

// Mobile Menu Toggle
document
  .querySelector(".mobile-menu-toggle")
  .addEventListener("click", function () {
    document.querySelector("nav ul").classList.toggle("show");
    this.classList.toggle("active");
  });

// Contact Form Handler
document
  .getElementById("contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Nachricht wurde gesendet! (Demo-Modus)");
    this.reset();
  });

// Automatische Logout-Prüfung alle 5 Minuten
setInterval(function () {
  if (isLoggedIn && !isLoginValid()) {
    console.log("Login automatisch abgelaufen");
    isLoggedIn = false;
    clearExpiredLogin();
    showLogin();
    alert("Ihre Session ist abgelaufen. Bitte melden Sie sich erneut an.");
  }
}, 5 * 60 * 1000); // Prüfe alle 5 Minuten
