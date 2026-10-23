import { PINNED } from "../src/data/pinned.ts";
import { escapeHtml } from "./badges.ts";

export function renderPinned(): string {
  const cards = PINNED.map((repo) => {
    const owner = escapeHtml(repo.owner);
    const repoName = escapeHtml(repo.repo);
    const desc = escapeHtml(repo.fallbackDescription);

    return `<button type="button" class="pinned-card text-left w-full bg-card border border-border rounded-xl p-5 hover:border-accent transition-colors cursor-pointer min-h-11 flex flex-col justify-between" data-owner="${owner}" data-repo="${repoName}" aria-haspopup="dialog">
  <span class="block">
    <span class="flex items-center gap-2 mb-2">
      <svg class="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
        <path d="M6 6h10"></path>
        <path d="M6 10h10"></path>
      </svg>
      <span class="font-mono text-accent font-medium truncate">${repoName}</span>
    </span>
    <span class="pinned-desc block text-sm text-fg-alt mb-4">${desc}</span>
  </span>
  <span class="flex items-center justify-between mt-auto pt-2">
    <span class="pinned-meta flex gap-4 text-xs text-fg-muted"></span>
    <span class="text-xs text-fg-muted">Preview</span>
  </span>
</button>`;
  });

  return `<div class="grid gap-4 md:grid-cols-2 md:[&>*:last-child:nth-child(odd)]:col-span-2">
${cards.join("\n")}
</div>`;
}
