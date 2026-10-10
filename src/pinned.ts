import { getRepo } from "./github";
import { openRepoPreview } from "./repo-preview";

const LANG_COLORS: Record<string, string> = {
  C: "#555555",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  Python: "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#663399",
  Shell: "#89e051",
};

function formatRelativeTime(dateString: string): string {
  const then = new Date(dateString).getTime();
  const now = Date.now();
  const diffSeconds = Math.round((then - now) / 1000);

  const units: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const { unit, seconds } of units) {
    const delta = Math.round(diffSeconds / seconds);
    if (Math.abs(delta) >= 1) {
      return rtf.format(delta, unit);
    }
  }

  return "just now";
}

export function initPinned(): void {
  const cards = document.querySelectorAll<HTMLButtonElement>(".pinned-card");

  cards.forEach((card) => {
    const owner = card.getAttribute("data-owner");
    const repo = card.getAttribute("data-repo");
    if (!owner || !repo) return;

    card.addEventListener("click", () => {
      openRepoPreview(owner, repo);
    });

    void (async () => {
      try {
        const data = await getRepo(owner, repo);

        // Update description if present
        if (data.description && data.description.trim()) {
          const descEl = card.querySelector<HTMLElement>(".pinned-desc");
          if (descEl) {
            descEl.textContent = data.description;
          }
        }

        // Fill meta row
        const metaEl = card.querySelector<HTMLElement>(".pinned-meta");
        if (metaEl) {
          metaEl.replaceChildren();

          // Language dot & name
          if (data.language) {
            const langWrapper = document.createElement("span");
            langWrapper.className = "flex items-center gap-1.5";

            const dot = document.createElement("span");
            dot.className = "w-2.5 h-2.5 rounded-full shrink-0";
            const color = LANG_COLORS[data.language] || "var(--color-fg-muted)";
            dot.style.backgroundColor = color;
            dot.setAttribute("aria-hidden", "true");

            const name = document.createElement("span");
            name.textContent = data.language;

            langWrapper.appendChild(dot);
            langWrapper.appendChild(name);
            metaEl.appendChild(langWrapper);
          }

          // Stars
          const starSpan = document.createElement("span");
          starSpan.textContent = `★ ${data.stargazers_count}`;
          metaEl.appendChild(starSpan);

          // Relative time
          if (data.pushed_at) {
            const timeSpan = document.createElement("span");
            timeSpan.textContent = `updated ${formatRelativeTime(data.pushed_at)}`;
            metaEl.appendChild(timeSpan);
          }
        }
      } catch {
        // Leave card as is on error
      }
    })();
  });
}
