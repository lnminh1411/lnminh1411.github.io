import type { Plugin } from "vite";
import { renderSocials, renderChips, escapeHtml, SKILLS, TOOLS, AGENTS, OPERATING_SYSTEMS } from "./badges.ts";
import { renderPinned } from "./pinned.ts";
import { getStatsUrl, getTopLangsUrl, getTrophyUrl, getStreakUrl } from "../src/config.ts";

export function htmlPlugin(): Plugin {
  return {
    name: "html-transform-plugin",
    transformIndexHtml(html: string): string {
      const statsHtml = `<a href="https://github.com/lnminh1411" target="_blank" rel="noopener" class="flex flex-col items-center gap-6 max-w-full">
  <picture>
    <source media="(max-width: 767px)" srcset="${escapeHtml(getTrophyUrl(true))}">
    <img src="${escapeHtml(getTrophyUrl(false))}" alt="GitHub profile trophies" loading="lazy" decoding="async" width="840" height="170" class="max-w-full h-auto">
  </picture>
  <span class="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-4 w-full">
    <img src="${escapeHtml(getStatsUrl())}" alt="GitHub stats" loading="lazy" decoding="async" width="467" height="195" class="max-w-full h-auto md:min-w-0 md:flex-[2395_1_0]">
    <img src="${escapeHtml(getTopLangsUrl())}" alt="Top languages" loading="lazy" decoding="async" width="320" height="190" class="max-w-full h-auto md:min-w-0 md:flex-[1684_1_0]">
  </span>
  <img src="${escapeHtml(getStreakUrl())}" alt="GitHub streak stats" loading="lazy" decoding="async" width="495" height="195" class="max-w-full h-auto">
</a>`;

      return html
        .replace(/<!--\s*@socials\s*-->/g, renderSocials())
        .replace(/<!--\s*@pinned\s*-->/g, renderPinned())
        .replace(/<!--\s*@skills\s*-->/g, renderChips(SKILLS, true))
        .replace(/<!--\s*@tools\s*-->/g, renderChips(TOOLS, true))
        .replace(/<!--\s*@agents\s*-->/g, renderChips(AGENTS, true))
        .replace(/<!--\s*@os\s*-->/g, renderChips(OPERATING_SYSTEMS, true))
        .replace(/<!--\s*@stats\s*-->/g, statsHtml);
    },
  };
}
