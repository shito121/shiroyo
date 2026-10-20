    document.getElementById("year").textContent = new Date().getFullYear();
    const contactDialog = document.getElementById("contact-dialog");
    document.querySelectorAll("[data-open-contact]").forEach((button) => {
      button.addEventListener("click", () => contactDialog.showModal());
    });
    contactDialog.querySelector(".contact-close").addEventListener("click", () => {
      contactDialog.close();
    });
    contactDialog.addEventListener("click", (event) => {
      if (event.target === contactDialog) contactDialog.close();
    });
