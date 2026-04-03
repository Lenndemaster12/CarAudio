// 1. Data voor alle calculators
const calculators = [
  {
  id: 1,
  titel: "Liters berekenen",
  inputs: [
    { id: "l", label: "Lengte (cm)" },
    { id: "b", label: "Breedte (cm)" },
    { id: "h", label: "Hoogte (cm)" }
  ],
  bereken: values => (values.l * values.b * values.h) / 1000
},
{
  id: 2,
  titel: "Ampere berekenen",
  inputs: [
    { id: "watt", label: "Wattage" },
    { id: "volt", label: "Voltage", type: "select", options: [12, 14, 14.4] }
  ],
  bereken: values => values.watt / values.volt
},
{
  id: 3,
  titel: "Gain instellen",
  inputs: [
    { id: "watt", label: "Wattage" },
    { id: "ohm", label: "Ohm" }
  ],
  bereken: values => Math.sqrt(values.watt * values.ohm)
},
  {
  id: 4,
  titel: "Kabeldikte berekenen",
  inputs: [
    { id: "watt", label: "Vermogen (W)" },
    { id: "volt", label: "Voltage", type: "select", options: [12, 13.8, 14.4], default: 12 },
    { id: "lengte", label: "Kabellengte heen (m)" },
    { 
      id: "materiaal", 
      label: "Materiaal", 
      type: "select", 
      options: ["OFC", "CCA"], 
      default: "CCA" 
    }
  ],
  bereken: values => {

    // --- 1. MATERIAAL DIRECT UIT DE SELECT HALEN ---
    let materiaal = "CCA"; // fallback

    try {
      const select = document.querySelector('select[id="materiaal"]');
      if (select) {
        const selectedText = select.options[select.selectedIndex].text.trim().toUpperCase();
        materiaal = selectedText.includes("CCA") ? "CCA" : "OFC";
      }
    } catch (e) {
      materiaal = "CCA";
    }

    // --- 2. Invoer ---
    const watt = parseFloat(values.watt) || 0;
    const volt = parseFloat(values.volt) || 12;
    const lengte = parseFloat(values.lengte) || 1;

    // --- 3. Stroom ---
    const I = watt / volt;

    // --- 4. Tabel ---
    const tabel = [
        { min: 0,   max: 20,  diktes: [2.5, 4, 4, 6, 8, 8, 8] },
        { min: 20,  max: 35,  diktes: [4, 6, 6, 8, 12, 20, 20] },
        { min: 35,  max: 50,  diktes: [6, 8, 8, 12, 20, 20, 35] },
        { min: 50,  max: 65,  diktes: [8, 8, 12, 16, 20, 35, 35] },
        { min: 65,  max: 85,  diktes: [12, 12, 20, 20, 35, 35, 53] },
        { min: 85,  max: 105, diktes: [12, 12, 20, 35, 35, 53, 53] },
        { min: 105, max: 125, diktes: [20, 20, 35, 35, 35, 53, 53] },
        { min: 125, max: 150, diktes: [35, 35, 35, 35, 53, 53, 60] },
        // --- UITBREIDING ---
        { min: 150, max: 175, diktes: [35, 35, 53, 53, 70, 70, 95] },
        { min: 175, max: 200, diktes: [35, 53, 53, 70, 70, 95, 95] },
        { min: 200, max: 225, diktes: [53, 53, 70, 70, 95, 95, 120] },
        { min: 225, max: 250, diktes: [53, 70, 70, 95, 95, 120, 120] },
        { min: 250, max: 275, diktes: [70, 70, 95, 95, 120, 120, 150] },
        { min: 275, max: 300, diktes: [70, 95, 95, 120, 120, 150, 150] }
    ];

    // --- 5. Lengtekolom ---
    const lengteRanges = [1, 3, 4, 5, 6, 7, 8];
    let col = lengteRanges.findIndex(l => lengte <= l);
    if (col === -1) col = lengteRanges.length - 1;

    // --- 6. Rij ---
    const rij = tabel.find(r => I >= r.min && I <= r.max);
    if (!rij) return `${I.toFixed(2)} A valt buiten de tabelbereiken.`;

    // --- 7. OFC-dikte ---
    let dikte = rij.diktes[col];

    // --- 8. CCA-correctie ---
    if (materiaal === "CCA") dikte *= 1.5;

    // --- 9. COMBINATIE-BEREKENING ---
    const beschikbareDiktes = [0.75, 1.5, 4, 6, 10, 16, 20, 25, 35, 50, 70];

    function berekenCombinatie(doel) {
      let beste = null;

      // 1 kabel
      for (let a of beschikbareDiktes) {
        if (a >= doel) return [a];
      }

      // 2 kabels
      for (let a of beschikbareDiktes) {
        for (let b of beschikbareDiktes) {
          const som = a + b;
          if (som >= doel) {
            if (!beste || som < beste.som) beste = { som, set: [a, b] };
          }
        }
      }

      // 3 kabels
      for (let a of beschikbareDiktes) {
        for (let b of beschikbareDiktes) {
          for (let c of beschikbareDiktes) {
            const som = a + b + c;
            if (som >= doel) {
              if (!beste || som < beste.som) beste = { som, set: [a, b, c] };
            }
          }
        }
      }

      return beste ? beste.set : null;
    }

    const combinatie = berekenCombinatie(dikte);
    const totaal = combinatie.reduce((a, b) => a + b, 0);

    // --- 10. Output ---
    return `${I.toFixed(2)} A → ${totaal} mm² (${materiaal})\n${combinatie.join(" mm² + ")} mm²`;
  }
}


,


  {
  id: 5,
  titel: "Fuse / zekering calculator",
  inputs: [
    { id: "watt", label: "Wattage van versterker" },
    { 
      id: "volt", 
      label: "Voltage", 
      type: "select", 
      options: [12, 13.8, 14.4],
      default: 12  // <-- standaard waarde
    }
  ],
  bereken: values => {
    const ampere = values.watt / values.volt; // stroom berekenen

    // Standaard zekeringen (A)
    const standaardZekeringen = [40, 50, 60, 70, 80, 100, 120, 150];

    // Kies de eerste zekering die hoger is dan de berekende stroom
    const aanbevolen = standaardZekeringen.find(fuse => fuse >= ampere) || standaardZekeringen[standaardZekeringen.length - 1];

    return `${ampere.toFixed(2)} A gemeten → gebruik ${aanbevolen} A zekering`;
  }
}

];


// 2. Haal ID uit URL
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

// 3. Zoek calculator
const calc = calculators.find(c => c.id === id);

// 4. Elementen
const titelEl = document.getElementById("titel");
const backBtn = document.getElementById("backBtn");
backBtn.addEventListener("click", () => {
  // Ga terug naar vorige pagina in browsergeschiedenis
  // window.history.back();

  // Of altijd naar index.html
  window.location.href = "index.html";
});

const contentEl = document.getElementById("content");

// 5. Render calculator
if (calc) {
  titelEl.textContent = calc.titel;

  // Maak inputs
  contentEl.innerHTML = calc.inputs.map(inp => {
  if (inp.type === "select") {
    // Voeg een placeholder als eerste option
    

    return `
    <div class="field">
        <select id="${inp.id}">
            <option value="" disabled selected hidden></option>
            ${inp.options.map(opt => `<option value="${opt}">${opt}</option>`).join("")}
        </select>
        <label for="${inp.id}">${inp.label}</label>
    </div>`;


  } else {
    // Gewone input
    return `
    <div class="field">
        <input id="${inp.id}" placeholder=" " />
        <label for="${inp.id}">${inp.label}</label>
    </div>`;

  }
}).join("");



  // Voeg knop toe
  contentEl.innerHTML += `<button id="berekenBtn">Bereken</button>
                          <p id="resultaat"></p>`;

  // 6. Event listener
  document.getElementById("berekenBtn").addEventListener("click", () => {
  const values = {};
  calc.inputs.forEach(inp => {
    const val = document.getElementById(inp.id).value;
    values[inp.id] = parseFloat(val);
  });

  let resultaat = calc.bereken(values);
  const resultaatEl = document.getElementById("resultaat");

  // Check of resultaat een number is
  if (typeof resultaat === "number") {
    resultaatEl.textContent = "= " + resultaat.toFixed(2);
  } else {
    // Voor strings (zoals fuse calculator)
    resultaatEl.textContent = "= " + resultaat;
  }

  // Pas border en padding zichtbaar
  resultaatEl.style.borderWidth = "1px";
  resultaatEl.style.padding = "30px";
  resultaatEl.style.opacity = "1";
});


}
