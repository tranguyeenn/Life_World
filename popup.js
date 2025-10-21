window.addEventListener("load", () => {
  const overlay = document.getElementById("popup-overlay");
  const mini = document.getElementById("popup-mini");
  const closeBtn = document.getElementById("popup-close");

  // Show popup at first
  overlay.classList.add("active");

  // Close popup, reveal mini block
  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
    mini.style.display = "block";
  });

  // When mini block is clicked, show popup again
  mini.addEventListener("click", () => {
    overlay.classList.add("active");
    mini.style.display = "none";
  });
});
