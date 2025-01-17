document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tabs-btn");
  const tabPanels = document.querySelectorAll(".tabs-panel");

  // Function to handle tab switching
  function handleTabClick(button) {
    const selectedTab = button.dataset.tabs;

    // Remove active state from all buttons
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Show or hide tab panels
    tabPanels.forEach((panel) => {
      const panelTabs = panel.dataset.tabs.split(" ");
      if (selectedTab === "all" || panelTabs.includes(selectedTab)) {
        panel.style.display = "block";
        panel.classList.add("active");
      } else {
        panel.style.display = "none";
        panel.classList.remove("active");
      }
    });
  }

  // Attach click events to all tab buttons
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => handleTabClick(button));
  });

  // Trigger the active tab logic on page load
  const activeTab = document.querySelector(".tabs-btn.active");
  if (activeTab) {
    handleTabClick(activeTab);
  }
});
