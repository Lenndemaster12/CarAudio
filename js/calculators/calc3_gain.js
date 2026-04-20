export default {
  id: 3,
  titel: "Amplifier Gain Setup (Vrms)",
  inputs: [
    { id: "watt", label: "Wattage" },
    { id: "ohm", label: "Ohm" }
  ],
  bereken: values => Math.sqrt(values.watt * values.ohm)
};
