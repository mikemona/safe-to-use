document.addEventListener("DOMContentLoaded", function () {
  const accordionHeaders = document.querySelectorAll(".accordion-item__header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const content = this.nextElementSibling;
      const icon = this.querySelector(".fa-angle-down");

      if (content.style.maxHeight) {
        content.style.maxHeight = null; // Close the accordion
        icon.classList.remove("rotate"); // Remove the rotation
      } else {
        content.style.maxHeight = content.scrollHeight + "px"; // Open the accordion
        icon.classList.add("rotate"); // Add the rotation
      }
    });
  });
});
