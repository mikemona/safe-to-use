document.addEventListener("DOMContentLoaded", () => {
    // Add click event listener to all elements with the class "backBTN"
    document.querySelectorAll(".backBTN").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = "/home.html"; // Replace with your fallback URL
        }
      });
    });
  });
  