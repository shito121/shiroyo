(() => {
  const storageKey = "portfolio-theme";
  const pageBody = document.body;
  const themeToggle = document.querySelector(".theme-toggle");

  if (!themeToggle) return;

  try {
    if (localStorage.getItem(storageKey) === "light") {
      pageBody.classList.add("light-theme");
    }
  } catch {
    // The toggle still works when browser storage is unavailable.
  }

  const updateToggle = () => {
    const isLightTheme = pageBody.classList.contains("light-theme");
    const label = isLightTheme ? "Aktifkan tema gelap" : "Aktifkan tema terang";

    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
    themeToggle.setAttribute("aria-pressed", String(isLightTheme));
  };

  themeToggle.addEventListener("click", () => {
    pageBody.classList.toggle("light-theme");

    try {
      localStorage.setItem(
        storageKey,
        pageBody.classList.contains("light-theme") ? "light" : "dark"
      );
    } catch {
      // The current page theme still updates without browser storage.
    }

    updateToggle();
  });

  updateToggle();
})();