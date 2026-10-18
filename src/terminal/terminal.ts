import { COMMANDS, type TerminalIO } from "./commands";
import { flashbang } from "../eggs";

export function initTerminal(getCurrentTagline: () => string): void {
  const logEl = document.getElementById("term-log");
  const inputEl = document.getElementById("term-input") as HTMLInputElement | null;
  const termPanel = document.getElementById("term-panel");

  if (!logEl || !inputEl) return;
  const log: HTMLElement = logEl;
  const input: HTMLInputElement = inputEl;

  const history: string[] = [];
  let historyIndex = -1;
  let draftInput = "";

  function scrollLogToBottom(): void {
    log.scrollTop = log.scrollHeight;
  }

  function appendPromptEcho(cmdText: string): void {
    const line = document.createElement("div");
    line.className = "flex text-sm my-0.5 break-all";

    const promptSpan = document.createElement("span");
    promptSpan.className = "select-none text-prompt shrink-0";
    promptSpan.textContent = "lnminh@vn";

    const sepSpan = document.createElement("span");
    sepSpan.className = "select-none text-fg-muted shrink-0";
    sepSpan.textContent = ":~$";

    const cmdSpan = document.createElement("span");
    cmdSpan.className = "text-fg ml-2";
    cmdSpan.textContent = cmdText;

    line.appendChild(promptSpan);
    line.appendChild(sepSpan);
    line.appendChild(cmdSpan);
    log.appendChild(line);
  }

  const io: TerminalIO = {
    print(text: string): void {
      const line = document.createElement("div");
      line.className = "text-sm text-fg my-0.5 whitespace-pre-wrap break-all";
      line.textContent = text;
      log.appendChild(line);
    },
    printMuted(text: string): void {
      const line = document.createElement("div");
      line.className = "text-sm text-fg-muted my-0.5 whitespace-pre-wrap break-all";
      line.textContent = text;
      log.appendChild(line);
    },
    printDanger(text: string): void {
      const line = document.createElement("div");
      line.className = "text-sm text-danger my-0.5 whitespace-pre-wrap break-all";
      line.textContent = text;
      log.appendChild(line);
    },
    printSuccess(text: string): void {
      const line = document.createElement("div");
      line.className = "text-sm text-accent my-0.5 whitespace-pre-wrap break-all";
      line.textContent = text;
      log.appendChild(line);
    },
    printLink(text: string, href: string, target?: string): void {
      const line = document.createElement("div");
      line.className = "text-sm my-0.5";
      const a = document.createElement("a");
      a.href = href;
      a.textContent = text;
      a.className = "text-accent hover:underline";
      if (target) {
        a.target = target;
        a.rel = "noopener";
      }
      line.appendChild(a);
      log.appendChild(line);
    },
    printKeyValue(key: string, value: string): void {
      const line = document.createElement("div");
      line.className = "text-sm my-0.5 break-all";

      const keySpan = document.createElement("span");
      keySpan.className = "text-accent whitespace-pre";
      keySpan.textContent = key.padEnd(10);

      const valSpan = document.createElement("span");
      valSpan.className = "text-fg";
      valSpan.textContent = value;

      line.appendChild(keySpan);
      line.appendChild(valSpan);
      log.appendChild(line);
    },
    printAction(text: string, onClick: () => void): void {
      const line = document.createElement("div");
      line.className = "text-sm my-0.5";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = text;
      btn.className = "text-accent hover:underline cursor-pointer";
      btn.addEventListener("click", onClick);
      line.appendChild(btn);
      log.appendChild(line);
    },
    printActions(items: Array<{ text: string; onClick?: () => void; href?: string }>): void {
      const line = document.createElement("div");
      line.className = "text-sm my-0.5 flex flex-wrap items-center gap-2";

      items.forEach((item, idx) => {
        if (item.onClick) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = item.text;
          btn.className = "text-accent hover:underline cursor-pointer";
          btn.addEventListener("click", item.onClick);
          line.appendChild(btn);
        } else if (item.href) {
          const a = document.createElement("a");
          a.href = item.href;
          a.textContent = item.text;
          a.className = "text-accent hover:underline";
          a.target = "_blank";
          a.rel = "noopener";
          line.appendChild(a);
        }

        if (idx < items.length - 1) {
          const sep = document.createElement("span");
          sep.className = "text-fg-muted select-none";
          sep.textContent = "  ";
          line.appendChild(sep);
        }
      });

      log.appendChild(line);
    },
    clear(): void {
      log.replaceChildren();
    },
    getHistory(): string[] {
      return [...history];
    },
    getCurrentTagline(): string {
      return getCurrentTagline();
    },
    triggerFlashbang(): void {
      flashbang();
    },
  };

  async function execute(rawInput: string): Promise<void> {
    const trimmed = rawInput.trim();
    appendPromptEcho(trimmed);

    if (trimmed.length > 0) {
      history.push(trimmed);
      historyIndex = -1;

      const [cmdName = "", ...args] = trimmed.split(/\s+/);
      const commandKey = cmdName.toLowerCase();
      const command = COMMANDS[commandKey];

      if (command) {
        try {
          await command.run(args, io);
        } catch {
          io.printDanger(`Error executing command: ${commandKey}`);
        }
      } else {
        io.printDanger(`command not found: ${cmdName} · try 'help'`);
      }
    }

    scrollLogToBottom();
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = input.value;
      input.value = "";
      void execute(val);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      if (historyIndex === -1) {
        draftInput = input.value;
        historyIndex = history.length - 1;
      } else if (historyIndex > 0) {
        historyIndex--;
      }
      const item = history[historyIndex];
      if (item !== undefined) {
        input.value = item;
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0 || historyIndex === -1) return;
      if (historyIndex < history.length - 1) {
        historyIndex++;
        const item = history[historyIndex];
        if (item !== undefined) {
          input.value = item;
        }
      } else {
        historyIndex = -1;
        input.value = draftInput;
      }
    } else if (e.key === "Tab") {
      const val = input.value.trim();
      if (val.length > 0) {
        e.preventDefault();
        const visibleCmds = Object.keys(COMMANDS).filter((k) => !COMMANDS[k]?.hidden);
        const matches = visibleCmds.filter((k) => k.startsWith(val.toLowerCase()));
        if (matches.length === 1 && matches[0]) {
          input.value = matches[0];
        } else if (matches.length > 1) {
          appendPromptEcho(input.value);
          io.print(matches.join("  "));
          scrollLogToBottom();
        }
      }
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      io.clear();
    } else if (e.key === "Escape") {
      input.blur();
    }
  });

  // Focus only when clicked inside terminal panel
  if (termPanel) {
    termPanel.addEventListener("click", (e) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("a") && !target?.closest("button")) {
        input.focus();
      }
    });
  }

  // "/" key to focus terminal input
  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const active = document.activeElement;
      const isInput =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active?.getAttribute("contenteditable") === "true";
      if (!isInput) {
        e.preventDefault();
        input.focus();
      }
    }
  });

  // Chip buttons
  const chipButtons = document.querySelectorAll<HTMLButtonElement>(".term-chip");
  chipButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-cmd");
      if (cmd) {
        void execute(cmd);
      }
    });
  });
}
