export default {
  id: 4,
  titel: "Power Cable Gauge (mm²)",
  unit: "",
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

    let materiaal = "CCA";

    try {
      const select = document.querySelector('select[id="materiaal"]');
      if (select) {
        const selectedText = select.options[select.selectedIndex].text.trim().toUpperCase();
        materiaal = selectedText.includes("CCA") ? "CCA" : "OFC";
      }
    } catch (e) {
      materiaal = "CCA";
    }

    const watt = parseFloat(values.watt) || 0;
    const volt = parseFloat(values.volt) || 12;
    const lengte = parseFloat(values.lengte) || 1;

    const I = watt / volt;

    const tabel = [
      { min: 0,   max: 20,  diktes: [2.5, 4, 4, 6, 8, 8, 8] },
      { min: 20,  max: 35,  diktes: [4, 6, 6, 8, 12, 20, 20] },
      { min: 35,  max: 50,  diktes: [6, 8, 8, 12, 20, 20, 35] },
      { min: 50,  max: 65,  diktes: [8, 8, 12, 16, 20, 35, 35] },
      { min: 65,  max: 85,  diktes: [12, 12, 20, 20, 35, 35, 53] },
      { min: 85,  max: 105, diktes: [12, 12, 20, 35, 35, 53, 53] },
      { min: 105, max: 125, diktes: [20, 20, 35, 35, 35, 53, 53] },
      { min: 125, max: 150, diktes: [35, 35, 35, 35, 53, 53, 60] },
      { min: 150, max: 175, diktes: [35, 35, 53, 53, 70, 70, 95] },
      { min: 175, max: 200, diktes: [35, 53, 53, 70, 70, 95, 95] },
      { min: 200, max: 225, diktes: [53, 53, 70, 70, 95, 95, 120] },
      { min: 225, max: 250, diktes: [53, 70, 70, 95, 95, 120, 120] },
      { min: 250, max: 275, diktes: [70, 70, 95, 95, 120, 120, 150] },
      { min: 275, max: 300, diktes: [70, 95, 95, 120, 120, 150, 150] }
    ];

    const lengteRanges = [1, 3, 4, 5, 6, 7, 8];
    let col = lengteRanges.findIndex(l => lengte <= l);
    if (col === -1) col = lengteRanges.length - 1;

    const rij = tabel.find(r => I >= r.min && I <= r.max);
    if (!rij) return `${I.toFixed(2)} A valt buiten de tabelbereiken.`;

    let dikte = rij.diktes[col];

    if (materiaal === "CCA") dikte *= 1.5;

    const beschikbareDiktes = [0.75, 1.5, 4, 6, 10, 16, 20, 25, 35, 50, 70];

    function berekenCombinatie(doel) {
      let beste = null;

      for (let a of beschikbareDiktes) {
        if (a >= doel) return [a];
      }

      for (let a of beschikbareDiktes) {
        for (let b of beschikbareDiktes) {
          const som = a + b;
          if (som >= doel) {
            if (!beste || som < beste.som) beste = { som, set: [a, b] };
          }
        }
      }

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

    // FIX: Als er maar 1 kabel is → GEEN tweede regel
    if (combinatie.length === 1) {
      return `${I.toFixed(2)} A → ${totaal} mm² (${materiaal})`;
    }

    // Meerdere kabels → toon combinatie
    return `${I.toFixed(2)} A → ${totaal} mm² (${materiaal})\n${combinatie.join(" mm² + ")} mm²`;
  }
};
