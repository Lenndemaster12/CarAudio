const items = [
    { id: 1, titel: "Liters berekenen" },
    { id: 2, titel: "Ampere berekenen" },
    { id: 3, titel: "Gain instellen" },
    { id: 4, titel: "Kabeldikte berekenen" },
    { id: 5, titel: "Fuse / zekering calculator" }
];

const container = document.getElementById("lijst");

items.forEach(item => {
  const blok = document.createElement("div");

  blok.innerHTML = `
    <a href="detail.html?id=${item.id}">
      <button>${item.titel}</button>
    </a>
  `;

  container.appendChild(blok);
});
