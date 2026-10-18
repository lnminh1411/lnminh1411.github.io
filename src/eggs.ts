export function rickroll(): void {
  window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank", "noopener");
}

let angerMeter = 1;
let isFlashing = false;

const TOOLTIP_TEXTS: Record<number, string> = {
  1: "Haven't learnt your lesson huh?",
  2: "Really?",
  3: "Damn.. Stop it!",
  4: "Fine have your Light mode...",
};

function createBanSvg(): SVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "w-5 h-5");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "10");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "m4.9 4.9 14.2 14.2");

  svg.appendChild(circle);
  svg.appendChild(path);
  return svg;
}

export function flashbang(): void {
  if (isFlashing) return;

  const moonBtn = document.getElementById("moon-btn");
  const flashOverlay = document.getElementById("flashbang");
  const tagline = document.getElementById("tagline");

  if (angerMeter > 5) {
    rickroll();
    return;
  }

  isFlashing = true;

  try {
    const audio = new Audio("/flashbang.mp3");
    audio.play().catch(() => {
      // Audio autoplay rejection handled silently
    });
  } catch {
    // Audio creation failure handled silently
  }

  if (flashOverlay) {
    flashOverlay.hidden = false;
    flashOverlay.classList.remove("flashing");
    // force reflow
    void flashOverlay.offsetWidth;
    flashOverlay.classList.add("flashing");
  }

  if (angerMeter >= 1 && angerMeter <= 4) {
    setTimeout(() => {
      if (flashOverlay) {
        flashOverlay.hidden = true;
        flashOverlay.classList.remove("flashing");
      }
      const tip = TOOLTIP_TEXTS[angerMeter];
      if (moonBtn && tip) {
        moonBtn.setAttribute("data-tip", tip);
      }
      angerMeter++;
      isFlashing = false;
    }, 7000);
  } else if (angerMeter === 5) {
    setTimeout(() => {
      if (flashOverlay) {
        flashOverlay.hidden = true;
        flashOverlay.classList.remove("flashing");
      }
      document.documentElement.classList.add("lit");
      if (tagline) {
        tagline.textContent = "Is this enough light for you?";
      }
      if (moonBtn) {
        moonBtn.setAttribute("data-tip", "Protect your eyes!");
        const banSvg = createBanSvg();
        moonBtn.replaceChildren(banSvg);
      }
      rickroll();
      angerMeter = 6;
      isFlashing = false;
    }, 2000);
  }
}

export function initEggs(): void {
  const moonBtn = document.getElementById("moon-btn");

  if (moonBtn) {
    moonBtn.addEventListener("click", () => {
      if (angerMeter > 5) {
        rickroll();
      } else {
        flashbang();
      }
    });
  }
}
