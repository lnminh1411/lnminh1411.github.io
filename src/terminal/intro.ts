export function initIntro(taglineText: string): void {
  const line1Cmd = document.getElementById("intro-cmd1");
  const h1 = document.getElementById("intro-h1");
  const line3 = document.getElementById("intro-line3");
  const line3Cmd = document.getElementById("intro-cmd2");
  const tagline = document.getElementById("tagline");
  const caret = document.getElementById("intro-caret");

  if (!line1Cmd || !h1 || !line3 || !line3Cmd || !tagline) {
    return;
  }

  tagline.textContent = taglineText;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    if (caret) caret.style.display = "inline-block";
    return;
  }

  let skipped = false;
  let currentTimeout: ReturnType<typeof setTimeout> | null = null;

  function skip(): void {
    if (skipped) return;
    skipped = true;
    if (currentTimeout) clearTimeout(currentTimeout);
    window.removeEventListener("keydown", skip);
    window.removeEventListener("pointerdown", skip);

    line1Cmd!.textContent = "whoami";
    h1!.style.opacity = "1";
    line3!.style.display = "block";
    line3Cmd!.textContent = "fortune";
    tagline!.style.opacity = "1";
    if (caret) caret.style.display = "inline-block";
  }

  window.addEventListener("keydown", skip);
  window.addEventListener("pointerdown", skip);

  // Initial state for animation
  line1Cmd.textContent = "";
  h1.style.opacity = "0";
  line3.style.display = "none";
  line3Cmd.textContent = "";
  tagline.style.opacity = "0";
  if (caret) caret.style.display = "none";

  const whoamiText = "whoami";
  const fortuneText = "fortune";

  let i = 0;
  function typeWhoami(): void {
    if (skipped) return;
    if (i < whoamiText.length) {
      line1Cmd!.textContent += whoamiText[i++];
      currentTimeout = setTimeout(typeWhoami, 70);
    } else {
      currentTimeout = setTimeout(() => {
        if (skipped) return;
        h1!.style.opacity = "1";
        line3!.style.display = "block";

        let j = 0;
        function typeFortune(): void {
          if (skipped) return;
          if (j < fortuneText.length) {
            line3Cmd!.textContent += fortuneText[j++];
            currentTimeout = setTimeout(typeFortune, 70);
          } else {
            currentTimeout = setTimeout(() => {
              if (skipped) return;
              tagline!.style.opacity = "1";
              if (caret) caret.style.display = "inline-block";
              window.removeEventListener("keydown", skip);
              window.removeEventListener("pointerdown", skip);
            }, 100);
          }
        }

        currentTimeout = setTimeout(typeFortune, 150);
      }, 250);
    }
  }

  currentTimeout = setTimeout(typeWhoami, 200);
}
