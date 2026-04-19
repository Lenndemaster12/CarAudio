export default {
  id: 3,
  titel: "Gain Setting",
  inputs: [
    { id: "watt", label: "Wattage" },
    { id: "ohm", label: "Ohm" }
  ],
  bereken: values => Math.sqrt(values.watt * values.ohm)
};
