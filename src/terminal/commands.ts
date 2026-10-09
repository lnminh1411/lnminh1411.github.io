import { getVietnamTimeInfo, getStatusDetails } from "../presence";
import { getPresence } from "../lanyard";

export interface TerminalIO {
  print(text: string): void;
  printMuted(text: string): void;
  printDanger(text: string): void;
  printSuccess(text: string): void;
  printLink(text: string, href: string, target?: string): void;
  clear(): void;
  getHistory(): string[];
  getCurrentTagline(): string;
  triggerFlashbang(): void;
  triggerRickroll(): void;
}

export interface CommandDefinition {
  description: string;
  hidden?: boolean;
  run(args: string[], io: TerminalIO): void | Promise<void>;
}

const OPEN_TARGETS: Record<string, string> = {
  github: "https://github.com/lnminh1411/",
  instagram: "https://www.instagram.com/im.lnminh1411",
  facebook: "https://www.facebook.com/im.lnminh1411",
  discord: "https://discord.com/users/1243939761614356544",
  email: "mailto:contact@lnminh1411.is-a.dev",
  messenger: "https://m.me/lenhatminh1411",
};

export const COMMANDS: Record<string, CommandDefinition> = {
  help: {
    description: "List all available commands",
    run(_args, io) {
      io.print("Available commands:");
      const visible = Object.entries(COMMANDS).filter(([, cmd]) => !cmd.hidden);
      for (const [name, cmd] of visible) {
        io.print(`  ${name.padEnd(10)}  ${cmd.description}`);
      }
    },
  },
  whoami: {
    description: "Display user info and current tagline",
    run(_args, io) {
      io.print("Lê Nhật Minh");
      io.printMuted(io.getCurrentTagline());
    },
  },
  about: {
    description: "Brief summary about me and jump to section",
    run(_args, io) {
      io.print("High school student and self-taught front-end developer.");
      io.printMuted("Building coding skills since 5th grade with experience across various languages.");
      io.printLink("↓ jump to section", "#about");
    },
  },
  skills: {
    description: "List programming skills and jump to section",
    run(_args, io) {
      io.print("Python, JavaScript, TypeScript, Node.js, HTML5, CSS3");
      io.printLink("↓ jump to section", "#skills");
    },
  },
  tools: {
    description: "List tools & environments I use",
    run(_args, io) {
      io.print("Windows Terminal, Git, Windows Insider Canary, WSL, Ubuntu, Firefox Developer, VS Code Insiders, Visual Studio");
      io.printLink("↓ jump to section", "#tools");
    },
  },
  stats: {
    description: "Summary of GitHub stats and jump to section",
    run(_args, io) {
      io.print("GitHub trophies, commit stats, top languages, and streaks.");
      io.printLink("↓ jump to section", "#stats");
    },
  },
  contact: {
    description: "List social links and contact info",
    run(_args, io) {
      io.print("Contact & Social links:");
      io.printLink("  GitHub:    lnminh1411", OPEN_TARGETS["github"]!, "_blank");
      io.printLink("  Instagram: @im.lnminh1411", OPEN_TARGETS["instagram"]!, "_blank");
      io.printLink("  Facebook:  @im.lnminh1411", OPEN_TARGETS["facebook"]!, "_blank");
      io.printLink("  Discord:   lnminh1411", OPEN_TARGETS["discord"]!, "_blank");
      io.printLink("  Email:     contact@lnminh1411.is-a.dev", OPEN_TARGETS["email"]!);
      io.printLink("  Messenger: lenhatminh1411", OPEN_TARGETS["messenger"]!, "_blank");
    },
  },
  open: {
    description: "Open social link in a new tab (e.g. open github)",
    run(args, io) {
      const target = args[0]?.toLowerCase();
      if (!target || !OPEN_TARGETS[target]) {
        io.printDanger("Usage: open <github|instagram|facebook|discord|email|messenger>");
        io.printMuted("Valid targets: github, instagram, facebook, discord, email, messenger");
        return;
      }
      const url = OPEN_TARGETS[target]!;
      window.open(url, "_blank", "noopener");
      io.print(`Opening ${target}...`);
    },
  },
  time: {
    description: "Show current time in Vietnam and relative offset",
    run(_args, io) {
      const t = getVietnamTimeInfo();
      io.print(`${t.clock24} · ${t.clock12} (${t.relative})`);
    },
  },
  status: {
    description: "Show live Discord / Spotify status",
    run(_args, io) {
      const pres = getPresence();
      const timeInfo = getVietnamTimeInfo();
      const details = getStatusDetails(pres, timeInfo.hour);
      let msg = details.text;
      if (pres?.listening_to_spotify && pres.spotify) {
        msg += ` · listening to ${pres.spotify.song} — ${pres.spotify.artist}`;
      }
      io.print(msg);
    },
  },
  history: {
    description: "Show command history",
    run(_args, io) {
      const history = io.getHistory();
      if (history.length === 0) {
        io.printMuted("No commands in history.");
      } else {
        history.forEach((cmd, idx) => {
          io.print(`${(idx + 1).toString().padStart(3, " ")}  ${cmd}`);
        });
      }
    },
  },
  echo: {
    description: "Print input text",
    run(args, io) {
      io.print(args.join(" "));
    },
  },
  clear: {
    description: "Clear terminal output log",
    run(_args, io) {
      io.clear();
    },
  },
  // Hidden commands
  lightmode: {
    description: "Light mode toggle",
    hidden: true,
    run(_args, io) {
      io.triggerFlashbang();
    },
  },
  theme: {
    description: "Theme toggle",
    hidden: true,
    run(args, io) {
      if (args[0]?.toLowerCase() === "light") {
        io.triggerFlashbang();
      } else {
        io.print("only dark here");
      }
    },
  },
  sudo: {
    description: "Superuser mode",
    hidden: true,
    run(_args, io) {
      io.print("nice try. this incident will be reported.");
    },
  },
  wake: {
    description: "Wake up sleeper",
    hidden: true,
    run(_args, io) {
      io.print("he's sleeping. you were warned.");
      io.triggerRickroll();
    },
  },
};
