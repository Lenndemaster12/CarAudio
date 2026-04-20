export default {
  id: 1,
  titel: "Enclosure Volume (liters)",
  unit: "liter",
  inputs: [
    { id: "l", label: "Lengte (cm)" },
    { id: "b", label: "Breedte (cm)" },
    { id: "h", label: "Hoogte (cm)" }
  ],
  bereken: values => (values.l * values.b * values.h) / 1000
};
