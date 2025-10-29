// src/components/admin/AdminDashboard.js

document.addEventListener("DOMContentLoaded", () => {
  const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");
  const sidebar = document.getElementById("sidebar");
  const menuBar = document.querySelector("#content nav .bx.bx-menu");

  // activate sidebar links
  allSideMenu.forEach((item) => {
    const li = item.parentElement;
    item.addEventListener("click", () => {
      allSideMenu.forEach((i) => i.parentElement.classList.remove("active"));
      li.classList.add("active");
    });
  });

  // toggle sidebar
  if (menuBar) {
    menuBar.addEventListener("click", () => {
      sidebar.classList.toggle("hide");
    });
  }

  // dark mode toggle
  const switchMode = document.getElementById("switch-mode");
  if (switchMode) {
    switchMode.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    });
  }
});
