import { calculators } from "./calculators.js";

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("lijst");

  // Repo-map automatisch bepalen (altijd correct)
  // Voorbeeld: /CarAudio/index.html → /CarAudio
  const path = window.location.pathname.split("/");

  // path[1] is ALTIJD de repo-naam, zelfs na back/reload/PWA
  const repo = path[1];

  // basePath wordt dus altijd /CarAudio
  const basePath = `/${repo}`;

  calculators.forEach(calc => {
    const blok = document.createElement("div");

    blok.innerHTML = `
      <a href="${basePath}/detail.html?id=${calc.id}">
        <button>${calc.titel}</button>
      </a>
    `;

    container.appendChild(blok);
  });

});
