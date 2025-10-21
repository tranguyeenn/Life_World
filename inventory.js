const invGrid = document.getElementById("inventory-grid");

function loadInventory() {
  return JSON.parse(localStorage.getItem("inventory") || "[]");
}

function renderInventory() {
  const items = loadInventory();
  invGrid.innerHTML = "";

  if (items.length === 0) {
    invGrid.textContent = "No items owned.";
    invGrid.style.color = "#ffffffff";
    invGrid.style.fontWeight = "600";
    invGrid.style.textAlign = "center";
    invGrid.style.opacity = "0.9";
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "inv-item";
    div.textContent = item.name;
    invGrid.appendChild(div);
  });
}

document.getElementById("back-btn").onclick = () => {
  window.location.href = "index.html";
};

renderInventory();
updateDashboard();