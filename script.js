const themeToggle = document.querySelector(".theme-toggle");

// Keep the button label and accessibility state in sync with the theme.
themeToggle.addEventListener("click", () => {
  const isDark = document.body.dataset.theme !== "dark";
  document.body.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.textContent = isDark ? "Switch to light mode" : "Switch to dark mode";
});
