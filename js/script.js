import { calculators } from "./calculators.js";

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("lijst");

  // Automatisch de juiste map bepalen
  // Voorbeeld: /CarAudio/index.html → /CarAudio
  const basePath = window.location.pathname.split("/").slice(0, -1).join("");

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
