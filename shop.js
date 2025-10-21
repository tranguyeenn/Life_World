const itemsForSale = [
  { id: 1, name: "Paper", price: 30 },
  { id: 2, name: "Pen", price: 20 },
  { id: 3, name: "Notebook", price: 25 },
  { id: 4, name: "Calculator", price: 50 }
];

const shopDiv = document.getElementById("shop-items");

function renderShop() {
  shopDiv.innerHTML = "";
  itemsForSale.forEach(item => {
    const card = document.createElement("div");
    card.className = "shop-item";
    card.innerHTML = `
      <strong>${item.name}</strong><br>
      Price: ${item.price} coins<br>
      <button data-id="${item.id}">Buy</button>
    `;
    shopDiv.appendChild(card);
  });
}

shopDiv.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const id = parseInt(e.target.getAttribute("data-id"));
    const item = itemsForSale.find(i => i.id === id);

    if (petStats.coins >= item.price) {
      petStats.coins -= item.price;

      let inv = JSON.parse(localStorage.getItem("inventory") || "[]");
      inv.push(item);
      localStorage.setItem("inventory", JSON.stringify(inv));

      saveStats(petStats);
      updateDashboard();
      alert("Bought " + item.name + "!");
    } else {
      alert("Not enough coins!");
    }
  }
});

document.getElementById("back-btn").onclick = () => {
  window.location.href = "index.html";
};

renderShop();
updateDashboard();