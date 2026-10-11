import * as icons from "simple-icons";

export interface BadgeItem {
  label: string;
  href?: string;
  iconKey?: string;
  fallbackHex: string;
  note?: string;
}

export interface SocialItem {
  name: string;
  href: string;
  ariaLabel: string;
  iconKey?: string;
  isEmail?: boolean;
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
    name: "Email",
    href: "mailto:contact@lnminh1411.is-a.dev",
    ariaLabel: "Send email",
    isEmail: true,
  },
  {
    name: "Messenger",
    href: "https://m.me/lenhatminh1411",
    ariaLabel: "Facebook Messenger",
    iconKey: "siMessenger",
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
    fallbackHex: "A6E3A1",
    note: "local",
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

      const iconHtml = icon
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
