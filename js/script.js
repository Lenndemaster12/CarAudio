import { calculators } from "./calculators.js";

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("lijst");

  calculators.forEach(calc => {
    const blok = document.createElement("div");

    blok.innerHTML = `
      <a href="detail.html?id=${calc.id}">
        <button>${calc.titel}</button>
      </a>
    `;

    container.appendChild(blok);
  });

});
