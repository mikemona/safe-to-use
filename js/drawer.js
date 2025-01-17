document.addEventListener("DOMContentLoaded", function () {
  const openDrawerButton = document.getElementById("openDrawer");
  const closeDrawerButton = document.getElementById("closeDrawer");
  const cancelDrawerButton = document.getElementById("cancelDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const drawer = document.getElementById("drawer");

  function openDrawer() {
    drawerOverlay.classList.add("open");
    drawer.classList.add("open");
  }

  function closeDrawer() {
    drawerOverlay.classList.remove("open");
    drawer.classList.remove("open");
  }

  openDrawerButton.addEventListener("click", openDrawer);
  closeDrawerButton.addEventListener("click", closeDrawer);
  cancelDrawerButton.addEventListener("click", closeDrawer);
});
