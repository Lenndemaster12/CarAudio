export default {
  id: 7,
  titel: "Port Flow Check",
  inputs: [
    { id: "type", label: "Poort type", type: "select", options: ["Ronde poort", "Rechthoekige poort"] },
    { id: "power", label: "Vermogen (W RMS)" }
  ],
  bereken: values => {
    const power = parseFloat(values.power);
    const rho = 1.18; // luchtdichtheid

    let A = 0; // poortoppervlak in m²

    if (values.type === "Ronde poort") {
      const d = parseFloat(values.d);
      const radius = (d / 100) / 2;
      A = Math.PI * radius * radius;
    }

    if (values.type === "Rechthoekige poort") {
      const h = parseFloat(values.h);
      const w = parseFloat(values.w);
      A = (h / 100) * (w / 100);
    }

    if (!A || !power) return "Ongeldige invoer";

    const v = Math.sqrt((2 * power) / (rho * A));

    let advies = "";
    if (v < 17) advies = "Perfect (SQ‑waardig)";
    else if (v < 25) advies = "Acceptabel (SPL/daily)";
    else advies = "Te hoog → kans op chuffing";

    return `Port velocity: ${v.toFixed(1)} m/s (${advies})`;
  }
};
