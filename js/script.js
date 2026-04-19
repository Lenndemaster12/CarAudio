import { calculators } from "./calculators.js";

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("lijst");

  // Repo-map automatisch bepalen (altijd correct)
  // Voorbeeld: /CarAudio/index.html → /CarAudio
  const path = window.location.pathname.split("/");
  const repo = path[1]; // tweede element is altijd de repo-naam
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
