export default {
  id: 2,
  titel: "Power draw (A)",
  inputs: [
    { id: "watt", label: "Wattage" },
    { id: "volt", label: "Voltage", type: "select", options: [12, 14, 14.4] }
  ],
  bereken: values => values.watt / values.volt
};
