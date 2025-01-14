document.addEventListener("DOMContentLoaded", () => {
  const selectElement = document.querySelector(".form-select");

  selectElement.addEventListener("click", () => {
    selectElement.classList.toggle("menu-open");
  });

  // Close the menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!selectElement.contains(event.target)) {
      selectElement.classList.remove("menu-open");
    }
  });
});
