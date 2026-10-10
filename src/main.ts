import "./style.css";
import { getRandomTagline } from "./terminal/taglines";
import { initIntro } from "./terminal/intro";
import { initTerminal } from "./terminal/terminal";
import { initPresence } from "./presence";
import { initEggs } from "./eggs";
import { initRepoPreview } from "./repo-preview";
import { initPinned } from "./pinned";

function initApp(): void {
  const currentTagline = getRandomTagline();

  // Wire tagline & intro
  initIntro(currentTagline);

  // Wire terminal
  initTerminal(() => currentTagline);

  // Wire presence card
  initPresence();

  // Wire easter eggs
  initEggs();

  // Wire pinned repos & preview dialog
  initRepoPreview();
  initPinned();

  // Wire footer year
  const footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear().toString();
  }

  // Wire stats img error handlers
  const statsImages = document.querySelectorAll<HTMLImageElement>("#stats img");
  statsImages.forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
  });

  // Wire down-arrow fadeout on scroll > 10
  const heroArrow = document.getElementById("hero-arrow");
  window.addEventListener(
    "scroll",
    () => {
      if (heroArrow) {
        if (window.scrollY > 10) {
          heroArrow.style.opacity = "0";
          heroArrow.style.pointerEvents = "none";
        } else {
          heroArrow.style.opacity = "1";
          heroArrow.style.pointerEvents = "auto";
        }
      }
    },
    { passive: true }
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
