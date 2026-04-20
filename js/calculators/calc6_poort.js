export default {
  id: 6,
  titel: "Port Tuning (Hz) / Length (cm)",
  inputs: [
    { 
      id: "mode", 
      label: "Berekeningstype", 
      type: "select", 
      options: [
        "Ronde poort → Lengte berekenen",
        "Ronde poort → Tuning berekenen",
        "Rechthoekige poort → Lengte berekenen",
        "Rechthoekige poort → Tuning berekenen"
      ]
    },
    {
      id: "volumemode",
      label: "Volume invoer",
      type: "select",
      options: [
        "Binnenmaten ingeven",
        "Liters direct ingeven"
      ]
    }
  ],
  bereken: () => "select"
};
