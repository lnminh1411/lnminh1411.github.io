import * as icons from "simple-icons";

export interface BadgeItem {
  label: string;
  href?: string;
  iconKey?: string;
  fallbackHex: string;
  note?: string;
  /** Trusted inline SVG markup (24x24 box) for brands missing from simple-icons. */
  svgBody?: string;
}

export interface SocialItem {
  name: string;
  href: string;
  ariaLabel: string;
  iconKey?: string;
  isEmail?: boolean;
  /** Trusted inline SVG markup for brands missing from simple-icons. */
  svgBody?: string;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const SOCIALS: SocialItem[] = [
  {
    name: "GitHub",
    href: "https://github.com/lnminh1411/",
    ariaLabel: "GitHub profile",
    iconKey: "siGithub",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/im.lnminh1411",
    ariaLabel: "Instagram profile",
    iconKey: "siInstagram",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/im.lnminh1411",
    ariaLabel: "Facebook profile",
    iconKey: "siFacebook",
  },
  {
    name: "Discord",
    href: "https://discord.com/users/1243939761614356544",
    ariaLabel: "Discord profile",
    iconKey: "siDiscord",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/nh%E1%BA%ADt-minh-l%C3%AA-a087a5425/",
    ariaLabel: "LinkedIn profile",
    svgBody:
      '<rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="6" y="10" width="2.5" height="8"/><circle cx="7.25" cy="6.75" r="1.5"/><path d="M11 18v-8h2.4v1.1c.5-.8 1.4-1.3 2.6-1.3 2 0 3 1.3 3 3.6V18h-2.5v-4.2c0-1.1-.4-1.8-1.4-1.8-1 0-1.6.7-1.6 1.8V18z"/>',
  },
  {
    name: "Email",
    href: "mailto:contact@lnminh1411.is-a.dev",
    ariaLabel: "Send email",
    isEmail: true,
  },
];

export const SKILLS: BadgeItem[] = [
  {
    label: "Python",
    href: "https://www.python.org/",
    iconKey: "siPython",
    fallbackHex: "14354C",
  },
  {
    label: "JavaScript",
    href: "https://www.javascript.com/",
    iconKey: "siJavascript",
    fallbackHex: "F7DF1E",
  },
  {
    label: "TypeScript",
    href: "https://www.typescriptlang.org/",
    iconKey: "siTypescript",
    fallbackHex: "3178C6",
  },
  {
    label: "Node.js",
    href: "https://nodejs.org/en",
    iconKey: "siNodedotjs",
    fallbackHex: "43853D",
  },
  {
    label: "HTML5",
    href: "https://html.com/",
    iconKey: "siHtml5",
    fallbackHex: "E34F26",
  },
  {
    label: "CSS3",
    href: "https://css3.com/",
    iconKey: "siCss",
    fallbackHex: "1572B6",
  },
];

export const TOOLS: BadgeItem[] = [
  {
    label: "Git",
    href: "https://git-scm.com/",
    iconKey: "siGit",
    fallbackHex: "E44C30",
  },
  {
    label: "WSL",
    href: "https://learn.microsoft.com/en-us/windows/wsl/",
    iconKey: "siLinux",
    fallbackHex: "0A97F5",
  },
  {
    label: "Ubuntu",
    href: "https://ubuntu.com/",
    iconKey: "siUbuntu",
    fallbackHex: "E95420",
  },
  {
    label: "Brave Nightly",
    href: "https://brave.com/download-nightly/",
    iconKey: "siBrave",
    fallbackHex: "FB542B",
  },
  {
    label: "VS Code Insiders",
    href: "https://code.visualstudio.com/insiders/",
    iconKey: "siVisualstudiocodeinsiders",
    fallbackHex: "22B39B",
  },
  {
    label: "Visual Studio",
    href: "https://visualstudio.microsoft.com/",
    iconKey: "siVisualstudio",
    fallbackHex: "5C2D91",
  },
];

export const AGENTS: BadgeItem[] = [
  {
    label: "Claude Code",
    href: "https://claude.com/claude-code",
    iconKey: "siClaude",
    fallbackHex: "D97757",
  },
  {
    label: "Google Antigravity",
    href: "https://antigravity.google",
    iconKey: "siGooglegemini",
    fallbackHex: "8E75B2",
  },
  {
    label: "Occamy 1.0 35B-A3B",
    href: "https://github.com/Accio-Lab/occamy",
    fallbackHex: "0E7063",
    svgBody:
      '<g transform="scale(0.01333) translate(0 210)"><path d="M596 389C698 204 900 69 1110 67C1455 54 1718 312 1730 661L1727 731L1718 779C1670 862 1565 947 1425 974L1363 977L1357 972C1468 872 1518 772 1510 645C1512 440 1357 276 1150 280C998 275 856 377 800 521Q795 537 787 526C732 460 676 431 601 401Q591 398 596 389Z"/><path d="M519 645C602 634 690 663 766 735C791 891 880 1001 1019 1067C1140 1110 1222 1091 1315 1046C1472 1048 1582 1007 1668 931Q1684 919 1676 937C1583 1154 1391 1308 1134 1309C784 1319 536 1057 518 742L516 680Z"/><path d="M68 257Q70 247 79 256L126 304C248 414 365 412 485 433C642 457 745 529 813 679Q822 693 809 685C728 617 656 597 570 582L494 582L429 584C233 576 90 477 68 278Z"/></g>',
  },
];

const iconsMap = icons as unknown as Record<string, { path: string; hex: string; title: string }>;

export function renderSocials(): string {
  return SOCIALS.map((social) => {
    const href = escapeHtml(social.href);
    const aria = escapeHtml(social.ariaLabel);

    if (social.isEmail) {
      const emailSvg = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`;
      return `<a href="${href}" aria-label="${aria}" class="inline-flex items-center justify-center w-11 h-11 text-fg-muted hover:text-fg focus-visible:text-fg transition-colors duration-150">${emailSvg}</a>`;
    }

    if (social.svgBody) {
      const svg = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${social.svgBody}</svg>`;
      return `<a href="${href}" target="_blank" rel="noopener" aria-label="${aria}" class="inline-flex items-center justify-center w-11 h-11 text-fg-muted hover:text-fg focus-visible:text-fg transition-colors duration-150">${svg}</a>`;
    }

    const icon = social.iconKey ? iconsMap[social.iconKey] : undefined;
    if (icon) {
      const svg = `<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${escapeHtml(icon.path)}"/></svg>`;
      return `<a href="${href}" target="_blank" rel="noopener" aria-label="${aria}" class="inline-flex items-center justify-center w-11 h-11 text-fg-muted hover:text-fg focus-visible:text-fg transition-colors duration-150">${svg}</a>`;
    }

    return `<a href="${href}" target="_blank" rel="noopener" aria-label="${aria}" class="inline-flex items-center justify-center w-11 h-11 text-fg-muted hover:text-fg focus-visible:text-fg transition-colors duration-150">${escapeHtml(social.name)}</a>`;
  }).join("\n");
}

export function renderChips(items: BadgeItem[]): string {
  return items
    .map((item) => {
      const label = escapeHtml(item.label);
      const icon = item.iconKey ? iconsMap[item.iconKey] : undefined;
      const hex = icon?.hex || item.fallbackHex;

      const iconHtml = item.svgBody
        ? `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${item.svgBody}</svg>`
        : icon
        ? `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${escapeHtml(icon.path)}"/></svg>`
        : `<span class="w-4 h-4 rounded-full shrink-0" style="background-color: #${hex};" aria-hidden="true"></span>`;

      const noteHtml = item.note
        ? `<span class="ml-1 rounded px-1.5 py-0.5 text-[11px] bg-muted text-fg-muted">${escapeHtml(item.note)}</span>`
        : "";

      const content = `${iconHtml}<span>${label}</span>${noteHtml}`;

      if (item.href) {
        const href = escapeHtml(item.href);
        return `<a class="chip inline-flex items-center gap-2 bg-card border border-border rounded-md px-3 py-2 min-h-11 text-sm font-medium hover:border-fg-muted transition-colors text-fg" href="${href}" target="_blank" rel="noopener" style="box-shadow: inset 3px 0 0 #${hex};">${content}</a>`;
      } else {
        return `<span class="chip inline-flex items-center gap-2 bg-card border border-border rounded-md px-3 py-2 min-h-11 text-sm font-medium text-fg" style="box-shadow: inset 3px 0 0 #${hex};">${content}</span>`;
      }
    })
    .join("\n");
}
