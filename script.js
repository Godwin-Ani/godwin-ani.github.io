const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// Toggle the mobile navigation menu.
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  // Close the menu after selecting a section.
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

// Display the current year in the footer.
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Reveal sections and cards gently as they enter the viewport.
// Content remains visible by default if IntersectionObserver is unavailable.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".section .container, .cv-inner, .contact-inner, .content-card, .publication, .experience-item"
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("js-reveal");
    if (element.classList.contains("content-card")) {
      element.style.transitionDelay = `${(index % 3) * 75}ms`;
    }
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealTargets.forEach((element) => revealObserver.observe(element));
}

// Highlight the navigation link for the section currently in view.
if ("IntersectionObserver" in window) {
  const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sectionById = new Map(
    sectionLinks
      .map((link) => [document.querySelector(link.getAttribute("href")), link])
      .filter(([section]) => section)
  );

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => link.removeAttribute("aria-current"));
      const activeLink = sectionById.get(entry.target);
      if (activeLink) activeLink.setAttribute("aria-current", "location");
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });

  sectionById.forEach((link, section) => navObserver.observe(section));
}
