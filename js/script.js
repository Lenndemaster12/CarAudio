import { calculators } from "./calculators.js";

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("lijst");

  // Repo-map automatisch bepalen
  // Voorbeeld: /CarAudio/index.html → /CarAudio
  const pathParts = window.location.pathname.split("/");
  const repoName = pathParts[1]; // tweede element is altijd de repo
  const basePath = "/" + repoName;

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
