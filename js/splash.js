// Splash skip bij back / reload
window.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash");

  // Check of splash al getoond is tijdens deze sessie
  const alreadyShown = sessionStorage.getItem("splashShown");

  if (alreadyShown) {
    // Splash overslaan (bij back of reload)
    splash.style.display = "none";
    return;
  }

  // Splash tonen bij echte app-start
  setTimeout(() => {
    splash.style.opacity = "0";
    setTimeout(() => splash.remove(), 500);
  }, 5000);

  sessionStorage.setItem("splashShown", "true");
});
