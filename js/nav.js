function loadNav() {
  const navHTML = `
    <div class="nav">
      <a
        href="home.html"
        class="btn nav-link"
        data-name="home"
        ><i class="fa fa-home"></i
      ></a>
      <a
        href="explore.html"
        class="btn nav-link"
        data-name="explore"
        ><i class="fa fa-magnifying-glass"></i
      ></a>
      <a
        href="upload.html"
        class="btn nav-link"
        data-name="upload"
        ><i class="fa fa-plus"></i
      ></a>
      <a
        href="purchases.html"
        class="btn nav-link"
        data-name="purchases"
        ><i class="fa fa-list"></i
      ></a>
      <a
        href="my-profile.html"
        class="btn nav-link"
        data-name="my-profile"
        ><i class="fa fa-user"></i
      ></a>
    </div>
  `;

  const navContainers = document.querySelectorAll(".nav-container");

  navContainers.forEach((navContainer) => {
    navContainer.innerHTML = navHTML;
    setActiveNavLink(navContainer.id); // Set active link based on the container ID
  });
}

function setActiveNavLink(pageId) {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const linkName = link.getAttribute("data-name");

    if (linkName === pageId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Load navigation on page load
document.addEventListener("DOMContentLoaded", loadNav);
