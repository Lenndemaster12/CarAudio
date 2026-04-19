import { calculators } from "./calculators.js";

// 1. Haal ID uit URL
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

// 2. Zoek calculator
const calc = calculators.find(c => c.id === id);

// 3. Elementen
const titelEl = document.getElementById("titel");
const backBtn = document.getElementById("backBtn");
const contentEl = document.getElementById("content");

backBtn.addEventListener("click", () => {
  window.location.href = "/CarAudio/index.html";
});


// 4. Render calculator
if (calc) {
  titelEl.textContent = calc.titel;

  // Basis inputs
  contentEl.innerHTML = calc.inputs.map(inp => {
    if (inp.type === "select") {
      return `
      <div class="field">
        <select id="${inp.id}">
          <option value="" disabled selected hidden></option>
          ${inp.options.map(opt => `<option value="${opt}">${opt}</option>`).join("")}
        </select>
        <label for="${inp.id}">${inp.label}</label>
      </div>`;
    }

    return `
    <div class="field">
      <input id="${inp.id}" placeholder=" " />
      <label for="${inp.id}">${inp.label}</label>
    </div>`;
  }).join("");

  // Extra secties voor dynamische velden
  contentEl.innerHTML += `
    <div id="volumeFields"></div>
    <div id="extraInputs"></div>
  `;

  // Bereken-knop
  contentEl.innerHTML += `
    <button id="berekenBtn">Bereken</button>
    <p id="resultaat"></p>
  `;

  // -----------------------------
  // 5. Dynamische velden
  // -----------------------------

  const modeSelect = document.getElementById("mode");
  const volumeSelect = document.getElementById("volumemode");
  const extra = document.getElementById("extraInputs");
  const volumeFields = document.getElementById("volumeFields");

  // Volume invoer (L×B×H of liters)
  if (volumeSelect) {
    volumeSelect.addEventListener("change", e => {
      const vmode = e.target.value;

      if (vmode === "Binnenmaten ingeven") {
        volumeFields.innerHTML = `
          <div class="field"><input id="l" placeholder=" " /><label>Kist lengte (cm)</label></div>
          <div class="field"><input id="b" placeholder=" " /><label>Kist breedte (cm)</label></div>
          <div class="field"><input id="h" placeholder=" " /><label>Kist hoogte (cm)</label></div>
        `;
      }

      if (vmode === "Liters direct ingeven") {
        volumeFields.innerHTML = `
          <div class="field"><input id="vb" placeholder=" " /><label>Kist volume (liter)</label></div>
        `;
      }
    });
  }

  // Poort type & berekeningstype
  if (modeSelect) {
    modeSelect.addEventListener("change", e => {
      const mode = e.target.value;

      if (mode.includes("Ronde poort") && mode.includes("Lengte")) {
        extra.innerHTML = `
          <div class="field"><input id="d" placeholder=" " /><label>Poort diameter (cm)</label></div>
          <div class="field"><input id="fb" placeholder=" " /><label>Gewenste tuning (Hz)</label></div>
        `;
      }

      if (mode.includes("Ronde poort") && mode.includes("Tuning")) {
        extra.innerHTML = `
          <div class="field"><input id="d" placeholder=" " /><label>Poort diameter (cm)</label></div>
          <div class="field"><input id="pl" placeholder=" " /><label>Poortlengte (cm)</label></div>
        `;
      }

      if (mode.includes("Rechthoekige") && mode.includes("Lengte")) {
        extra.innerHTML = `
          <div class="field"><input id="ph" placeholder=" " /><label>Poort hoogte (cm)</label></div>
          <div class="field"><input id="pw" placeholder=" " /><label>Poort breedte (cm)</label></div>
          <div class="field"><input id="fb" placeholder=" " /><label>Gewenste tuning (Hz)</label></div>
        `;
      }

      if (mode.includes("Rechthoekige") && mode.includes("Tuning")) {
        extra.innerHTML = `
          <div class="field"><input id="ph" placeholder=" " /><label>Poort hoogte (cm)</label></div>
          <div class="field"><input id="pw" placeholder=" " /><label>Poort breedte (cm)</label></div>
          <div class="field"><input id="pl" placeholder=" " /><label>Poortlengte (cm)</label></div>
        `;
      }
    });
  }

  // Port area check (id 7)
  if (calc.id === 7) {
    const typeSelect = document.getElementById("type");

    typeSelect.addEventListener("change", e => {
      const type = e.target.value;

      if (type === "Ronde poort") {
        extra.innerHTML = `
          <div class="field"><input id="d" placeholder=" " /><label>Diameter (cm)</label></div>
        `;
      }

      if (type === "Rechthoekige poort") {
        extra.innerHTML = `
          <div class="field"><input id="h" placeholder=" " /><label>Hoogte (cm)</label></div>
          <div class="field"><input id="w" placeholder=" " /><label>Breedte (cm)</label></div>
        `;
      }
    });
  }

  // -----------------------------
  // 6. Berekening
  // -----------------------------

  document.getElementById("berekenBtn").addEventListener("click", () => {
    // Verzamel alle basis inputs automatisch
const values = {};
calc.inputs.forEach(inp => {
  const el = document.getElementById(inp.id);
  if (el) values[inp.id] = el.value;
});

let resultaat = calc.bereken(values);


    // PORT TUNING (id 6)
    if (calc.id === 6) {
      const mode = document.getElementById("mode").value;
      const vmode = document.getElementById("volumemode").value;

      let Vb = 0;

      if (vmode === "Binnenmaten ingeven") {
        const l = parseFloat(document.getElementById("l")?.value);
        const b = parseFloat(document.getElementById("b")?.value);
        const h = parseFloat(document.getElementById("h")?.value);
        Vb = (l * b * h) / 1000;
      }

      if (vmode === "Liters direct ingeven") {
        Vb = parseFloat(document.getElementById("vb")?.value);
      }

      // Ronde poort → Lengte
      if (mode.includes("Ronde poort") && mode.includes("Lengte")) {
        const d = parseFloat(document.getElementById("d").value);
        const fb = parseFloat(document.getElementById("fb").value);

        const L = (23562.5 * (d ** 2)) / (fb ** 2 * Vb) - 0.732 * d;
        resultaat = `Poortlengte = ${L.toFixed(2)} cm`;
      }

      // Ronde poort → Tuning
      if (mode.includes("Ronde poort") && mode.includes("Tuning")) {
        const d = parseFloat(document.getElementById("d").value);
        const pl = parseFloat(document.getElementById("pl").value);

        const Fb = Math.sqrt((23562.5 * (d ** 2)) / (Vb * (pl + 0.732 * d)));
        resultaat = `Tuning = ${Fb.toFixed(2)} Hz`;
      }

      // Rechthoekige → Lengte
      if (mode.includes("Rechthoekige") && mode.includes("Lengte")) {
        const ph = parseFloat(document.getElementById("ph").value);
        const pw = parseFloat(document.getElementById("pw").value);
        const fb = parseFloat(document.getElementById("fb").value);

        const A = ph * pw;
        const D = Math.sqrt((4 * A) / Math.PI);

        const L = (23562.5 * (D ** 2)) / (fb ** 2 * Vb) - 0.732 * D;
        resultaat = `Poortlengte = ${L.toFixed(2)} cm`;
      }

      // Rechthoekige → Tuning
      if (mode.includes("Rechthoekige") && mode.includes("Tuning")) {
        const ph = parseFloat(document.getElementById("ph").value);
        const pw = parseFloat(document.getElementById("pw").value);
        const pl = parseFloat(document.getElementById("pl").value);

        const A = ph * pw;
        const D = Math.sqrt((4 * A) / Math.PI);

        const Fb = Math.sqrt((23562.5 * (D ** 2)) / (Vb * (pl + 0.732 * D)));
        resultaat = `Tuning = ${Fb.toFixed(2)} Hz`;
      }
    }

    // PORT AREA CHECK (id 7)
    if (calc.id === 7) {
      const type = document.getElementById("type")?.value;
      const power = parseFloat(document.getElementById("power")?.value);

      if (!type) {
        resultaat = "Kies eerst een poorttype.";
      } else if (isNaN(power) || power <= 0) {
        resultaat = "Vul een geldig vermogen in (W RMS).";
      } else {
        let A = 0; // cm²

        if (type === "Ronde poort") {
          const d = parseFloat(document.getElementById("d")?.value);
          if (isNaN(d) || d <= 0) {
            resultaat = "Vul een geldige diameter in (cm).";
          } else {
            A = Math.PI * (d / 2) * (d / 2);
          }
        }

        if (type === "Rechthoekige poort") {
          const h = parseFloat(document.getElementById("h")?.value);
          const w = parseFloat(document.getElementById("w")?.value);
          if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
            resultaat = "Vul geldige hoogte en breedte in (cm).";
          } else {
            A = h * w;
          }
        }

        if (A > 0) {
          const required = (power / 100) * 8; // vuistregel
          const ratio = A / required;

          let advies = "";
          if (ratio >= 1.3) advies = "Ruim voldoende (SQ / rustig).";
          else if (ratio >= 1.0) advies = "Voldoende (daily).";
          else if (ratio >= 0.7) advies = "Klein → kans op chuffing bij hoog volume.";
          else advies = "Veel te klein → hoge kans op chuffing.";

          resultaat = `Poortoppervlak: ${A.toFixed(1)} cm²
Aanbevolen minimaal: ${required.toFixed(1)} cm²
→ ${advies}`;
        }
      }
    }

    // Resultaat tonen
    const resultaatEl = document.getElementById("resultaat");
    resultaatEl.textContent = "= " + resultaat;
    resultaatEl.style.borderWidth = "1px";
    resultaatEl.style.padding = "30px";
    resultaatEl.style.opacity = "1";
  });
}
