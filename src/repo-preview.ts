import DOMPurify from "dompurify";
import { getRepo, getContents, getReadmeHtml, GitHubError, type ContentItem } from "./github";

let currentToken = 0;
let currentOwner = "";
let currentRepo = "";
let currentBranch = "main";
let currentPath = "";

function createSvgIcon(type: "folder" | "file"): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");

  if (type === "folder") {
    svg.setAttribute("class", "w-4 h-4 text-accent shrink-0");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"
    );
    svg.appendChild(path);
  } else {
    svg.setAttribute("class", "w-4 h-4 text-fg-muted shrink-0");
    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z");
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M14 2v4a2 2 0 0 0 2 2h4");
    svg.appendChild(path1);
    svg.appendChild(path2);
  }

  return svg;
}

function renderErrorPane(
  container: HTMLElement,
  error: unknown,
  repoUrl: string,
  isReadme = false
): void {
  container.replaceChildren();
  const div = document.createElement("div");
  div.className = "p-6 text-sm text-fg-muted";

  let message = "Couldn't load from GitHub.";
  if (error instanceof GitHubError) {
    if (error.kind === "rate-limit") {
      message = "GitHub rate limit reached. Try again later or ";
    } else if (error.kind === "not-found" && isReadme) {
      div.textContent = "No README";
      container.appendChild(div);
      return;
    }
  }

  const textNode = document.createTextNode(message);
  div.appendChild(textNode);

  if (message.endsWith("or ") || message.startsWith("Couldn't")) {
    if (message.startsWith("Couldn't")) {
      const space = document.createTextNode(" ");
      div.appendChild(space);
    }
    const link = document.createElement("a");
    link.href = repoUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "text-accent hover:underline";
    link.textContent = "open on GitHub ↗";
    div.appendChild(link);
  }

  container.appendChild(div);
}

function renderBreadcrumb(
  repoName: string,
  path: string,
  onNavigate: (newPath: string) => void
): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "flex items-center gap-1.5 p-3 border-b border-border text-sm font-mono overflow-x-auto shrink-0";
  nav.setAttribute("aria-label", "Breadcrumb");

  const rootBtn = document.createElement("button");
  rootBtn.type = "button";
  rootBtn.className = "text-accent hover:underline cursor-pointer shrink-0";
  rootBtn.textContent = repoName;
  rootBtn.addEventListener("click", () => onNavigate(""));
  nav.appendChild(rootBtn);

  if (!path) return nav;

  const parts = path.split("/").filter(Boolean);
  let accumulated = "";

  for (let i = 0; i < parts.length; i++) {
    const sep = document.createElement("span");
    sep.className = "text-fg-muted select-none";
    sep.textContent = "/";
    nav.appendChild(sep);

    const part = parts[i]!;
    accumulated = accumulated ? `${accumulated}/${part}` : part;
    const targetPath = accumulated;

    if (i === parts.length - 1) {
      const currentPartSpan = document.createElement("span");
      currentPartSpan.className = "text-fg truncate";
      currentPartSpan.textContent = part;
      nav.appendChild(currentPartSpan);
    } else {
      const partBtn = document.createElement("button");
      partBtn.type = "button";
      partBtn.className = "text-accent hover:underline cursor-pointer truncate shrink-0";
      partBtn.textContent = part;
      partBtn.addEventListener("click", () => onNavigate(targetPath));
      nav.appendChild(partBtn);
    }
  }

  return nav;
}

function renderCodeList(
  items: ContentItem[],
  onNavigate: (newPath: string) => void
): HTMLElement {
  const ul = document.createElement("ul");
  ul.setAttribute("role", "list");
  ul.className = "divide-y divide-border/50";

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "font-mono text-sm py-2 px-4 hover:bg-muted transition-colors flex items-center gap-2.5";

    if (item.type === "dir") {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "w-full flex items-center gap-2 text-left text-fg hover:text-accent cursor-pointer truncate";
      const icon = createSvgIcon("folder");
      const span = document.createElement("span");
      span.className = "truncate";
      span.textContent = item.name;
      btn.appendChild(icon);
      btn.appendChild(span);
      btn.addEventListener("click", () => onNavigate(item.path));
      li.appendChild(btn);
    } else {
      const link = document.createElement("a");
      link.href = item.html_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "w-full flex items-center gap-2 text-left text-fg-alt hover:text-fg hover:underline truncate";
      const icon = createSvgIcon("file");
      const span = document.createElement("span");
      span.className = "truncate";
      span.textContent = item.name;
      link.appendChild(icon);
      link.appendChild(span);
      li.appendChild(link);
    }

    ul.appendChild(li);
  }

  return ul;
}

async function loadCodePath(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  token: number
): Promise<void> {
  const codeContainer = document.getElementById("repo-code");
  if (!codeContainer) return;

  currentPath = path;

  // Breadcrumb
  const breadcrumb = renderBreadcrumb(repo, path, (newPath) => {
    void loadCodePath(owner, repo, branch, newPath, token);
  });

  // Loading indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "p-4 text-sm font-mono text-fg-muted";
  loadingDiv.textContent = "Loading…";

  codeContainer.replaceChildren(breadcrumb, loadingDiv);

  try {
    const items = await getContents(owner, repo, path, branch);
    if (token !== currentToken) return;

    const list = renderCodeList(items, (newPath) => {
      void loadCodePath(owner, repo, branch, newPath, token);
    });

    codeContainer.replaceChildren(breadcrumb, list);
  } catch (err) {
    if (token !== currentToken) return;
    const repoUrl = `https://github.com/${owner}/${repo}`;
    renderErrorPane(codeContainer, err, repoUrl, false);
  }
}

async function loadReadme(
  owner: string,
  repo: string,
  branch: string,
  token: number
): Promise<void> {
  const readmeContainer = document.getElementById("repo-readme");
  if (!readmeContainer) return;

  const loadingDiv = document.createElement("div");
  loadingDiv.className = "p-6 text-sm text-fg-muted";
  loadingDiv.textContent = "Loading…";
  readmeContainer.replaceChildren(loadingDiv);

  const repoUrl = `https://github.com/${owner}/${repo}`;

  try {
    const rawHtml = await getReadmeHtml(owner, repo);
    if (token !== currentToken) return;

    const frag = DOMPurify.sanitize(rawHtml, {
      RETURN_DOM_FRAGMENT: true,
      USE_PROFILES: { html: true, svg: true },
      FORBID_TAGS: ["style", "form", "input", "button", "textarea", "select", "iframe"],
      FORBID_ATTR: ["style"],
    }) as DocumentFragment;

    // Transform imgs and videos
    const mediaElements = frag.querySelectorAll<HTMLImageElement | HTMLVideoElement>("img, video");
    mediaElements.forEach((el) => {
      const src = el.getAttribute("src");
      if (src && !/^(https?:|data:|\/\/)/i.test(src)) {
        try {
          const resolvedPath = new URL(src, "https://placeholder/").pathname.replace(/^\/+/, "");
          el.src = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${resolvedPath}`;
        } catch {
          // ignore invalid url
        }
      }
      if (el instanceof HTMLImageElement) {
        el.loading = "lazy";
      }
    });

    // Transform links
    const linkElements = frag.querySelectorAll<HTMLAnchorElement>("a");
    linkElements.forEach((a) => {
      const href = a.getAttribute("href");
      if (href) {
        if (!href.startsWith("#")) {
          if (!/^(https?:|data:|\/\/|mailto:)/i.test(href)) {
            try {
              const resolved = new URL(href, "https://placeholder/");
              const resolvedPath = resolved.pathname.replace(/^\/+/, "");
              a.href = `https://github.com/${owner}/${repo}/blob/${branch}/${resolvedPath}${resolved.search}${resolved.hash}`;
            } catch {
              // ignore
            }
          }
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
      }
    });

    const article = document.createElement("article");
    article.className = "markdown-body";
    article.appendChild(frag);

    readmeContainer.replaceChildren(article);
  } catch (err) {
    if (token !== currentToken) return;
    renderErrorPane(readmeContainer, err, repoUrl, true);
  }
}

export function openRepoPreview(owner: string, repo: string): void {
  const dialog = document.getElementById("repo-dialog") as HTMLDialogElement | null;
  if (!dialog) return;

  const token = ++currentToken;
  currentOwner = owner;
  currentRepo = repo;
  currentBranch = "main";
  currentPath = "";

  const titleLink = document.getElementById("repo-dialog-title") as HTMLAnchorElement | null;
  if (titleLink) {
    titleLink.textContent = `${owner}/${repo}`;
    titleLink.href = `https://github.com/${owner}/${repo}`;
  }

  // Mobile tabs reset to Code
  setMobileTab("code");

  // Show loading rows in panes
  const codeContainer = document.getElementById("repo-code");
  const readmeContainer = document.getElementById("repo-readme");
  if (codeContainer) {
    const loadingCode = document.createElement("div");
    loadingCode.className = "p-4 text-sm font-mono text-fg-muted";
    loadingCode.textContent = "Loading…";
    codeContainer.replaceChildren(loadingCode);
  }
  if (readmeContainer) {
    const loadingReadme = document.createElement("div");
    loadingReadme.className = "p-6 text-sm text-fg-muted";
    loadingReadme.textContent = "Loading…";
    readmeContainer.replaceChildren(loadingReadme);
  }

  dialog.showModal();
  document.documentElement.classList.add("overflow-hidden");

  const closeBtn = document.getElementById("repo-dialog-close") as HTMLButtonElement | null;
  closeBtn?.focus();

  // Load repo info then contents & readme
  void (async () => {
    let branch = "main";
    try {
      const repoDetails = await getRepo(owner, repo);
      if (token !== currentToken) return;
      branch = repoDetails.default_branch || "main";
      currentBranch = branch;
      if (titleLink) {
        titleLink.href = repoDetails.html_url;
      }
    } catch (err) {
      if (token !== currentToken) return;
      const repoUrl = `https://github.com/${owner}/${repo}`;
      if (codeContainer) renderErrorPane(codeContainer, err, repoUrl, false);
      if (readmeContainer) renderErrorPane(readmeContainer, err, repoUrl, true);
      return;
    }

    void loadCodePath(owner, repo, branch, "", token);
    void loadReadme(owner, repo, branch, token);
  })();
}

function setMobileTab(tab: "code" | "readme"): void {
  const codeBtn = document.getElementById("repo-tab-code");
  const readmeBtn = document.getElementById("repo-tab-readme");
  const codePane = document.getElementById("repo-code");
  const readmePane = document.getElementById("repo-readme");

  if (tab === "code") {
    codeBtn?.setAttribute("aria-pressed", "true");
    codeBtn?.classList.add("border-accent", "text-accent");
    codeBtn?.classList.remove("border-transparent", "text-fg-muted");

    readmeBtn?.setAttribute("aria-pressed", "false");
    readmeBtn?.classList.remove("border-accent", "text-accent");
    readmeBtn?.classList.add("border-transparent", "text-fg-muted");

    codePane?.classList.remove("max-md:hidden");
    readmePane?.classList.add("max-md:hidden");
  } else {
    codeBtn?.setAttribute("aria-pressed", "false");
    codeBtn?.classList.remove("border-accent", "text-accent");
    codeBtn?.classList.add("border-transparent", "text-fg-muted");

    readmeBtn?.setAttribute("aria-pressed", "true");
    readmeBtn?.classList.add("border-accent", "text-accent");
    readmeBtn?.classList.remove("border-transparent", "text-fg-muted");

    codePane?.classList.add("max-md:hidden");
    readmePane?.classList.remove("max-md:hidden");
  }
}

export function initRepoPreview(): void {
  const dialog = document.getElementById("repo-dialog") as HTMLDialogElement | null;
  if (!dialog) return;

  const closeBtn = document.getElementById("repo-dialog-close");
  closeBtn?.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("overflow-hidden");
  });

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      dialog.close();
    }
  });

  const codeTab = document.getElementById("repo-tab-code");
  const readmeTab = document.getElementById("repo-tab-readme");

  codeTab?.addEventListener("click", () => setMobileTab("code"));
  readmeTab?.addEventListener("click", () => setMobileTab("readme"));
}
