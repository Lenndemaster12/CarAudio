export default {
  id: 5,
  titel: "Fuse Rating",
  inputs: [
    { id: "watt", label: "Wattage van versterker" },
    { 
      id: "volt", 
      label: "Voltage", 
      type: "select", 
      options: [12, 13.8, 14.4],
      default: 12
    }
  ],
  bereken: values => {
    const ampere = values.watt / values.volt;
    const standaardZekeringen = [40, 50, 60, 70, 80, 100, 120, 150];
    const aanbevolen = standaardZekeringen.find(f => f >= ampere) || 150;
    return `${ampere.toFixed(2)} A gemeten → gebruik ${aanbevolen} A zekering`;
  }
};
