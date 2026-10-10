const API = "https://api.github.com";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export class GitHubError extends Error {
  readonly kind: "rate-limit" | "not-found" | "network";

  constructor(kind: "rate-limit" | "not-found" | "network", message?: string) {
    super(message || kind);
    this.name = "GitHubError";
    this.kind = kind;
  }
}

interface CacheEntry<T> {
  t: number;
  body: T;
}

function getFromCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() - parsed.t < CACHE_TTL_MS) {
      return parsed.body;
    }
    sessionStorage.removeItem(key);
  } catch {
    // Ignore sessionStorage errors
  }
  return null;
}

function setInCache<T>(key: string, body: T): void {
  try {
    const entry: CacheEntry<T> = { t: Date.now(), body };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Ignore sessionStorage errors
  }
}

export interface RepoDetails {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  default_branch: string;
}

export interface ContentItem {
  name: string;
  path: string;
  type: "file" | "dir" | "symlink" | "submodule";
  html_url: string;
}

export async function getRepo(owner: string, repo: string): Promise<RepoDetails> {
  const url = `${API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const accept = "application/vnd.github.v3+json";
  const cacheKey = `gh:${accept}:${url}`;

  const cached = getFromCache<RepoDetails>(cacheKey);
  if (cached) return cached;

  let res: Response;
  try {
    res = await fetch(url, { headers: { Accept: accept } });
  } catch {
    throw new GitHubError("network", "Network error while fetching repository");
  }

  if (res.status === 404) {
    throw new GitHubError("not-found", "Repository not found");
  }

  const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
  if (res.status === 429 || (res.status === 403 && rateLimitRemaining === "0")) {
    throw new GitHubError("rate-limit", "GitHub rate limit exceeded");
  }

  if (!res.ok) {
    throw new GitHubError("network", `Unexpected HTTP status ${res.status}`);
  }

  const data = (await res.json()) as RepoDetails;
  const result: RepoDetails = {
    name: data.name,
    full_name: data.full_name,
    description: data.description ?? null,
    html_url: data.html_url,
    language: data.language ?? null,
    stargazers_count: data.stargazers_count ?? 0,
    pushed_at: data.pushed_at,
    default_branch: data.default_branch || "main",
  };

  setInCache(cacheKey, result);
  return result;
}

export async function getContents(
  owner: string,
  repo: string,
  path = "",
  ref?: string
): Promise<ContentItem[]> {
  const encodedPath = path
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
  const urlBase = `${API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodedPath}`;
  const url = ref ? `${urlBase}?ref=${encodeURIComponent(ref)}` : urlBase;
  const accept = "application/vnd.github.v3+json";
  const cacheKey = `gh:${accept}:${url}`;

  const cached = getFromCache<ContentItem[]>(cacheKey);
  if (cached) return cached;

  let res: Response;
  try {
    res = await fetch(url, { headers: { Accept: accept } });
  } catch {
    throw new GitHubError("network", "Network error while fetching contents");
  }

  if (res.status === 404) {
    throw new GitHubError("not-found", "Path not found");
  }

  const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
  if (res.status === 429 || (res.status === 403 && rateLimitRemaining === "0")) {
    throw new GitHubError("rate-limit", "GitHub rate limit exceeded");
  }

  if (!res.ok) {
    throw new GitHubError("network", `Unexpected HTTP status ${res.status}`);
  }

  const data = await res.json();
  const items: unknown[] = Array.isArray(data) ? data : [data];

  const parsedItems: ContentItem[] = items.map((item) => {
    const raw = item as Record<string, unknown>;
    return {
      name: String(raw["name"] ?? ""),
      path: String(raw["path"] ?? ""),
      type: (raw["type"] as ContentItem["type"]) || "file",
      html_url: String(raw["html_url"] ?? ""),
    };
  });

  // Sort: dirs first, then files, each case-insensitive alphabetical
  parsedItems.sort((a, b) => {
    const aIsDir = a.type === "dir";
    const bIsDir = b.type === "dir";
    if (aIsDir && !bIsDir) return -1;
    if (!aIsDir && bIsDir) return 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "accent" });
  });

  setInCache(cacheKey, parsedItems);
  return parsedItems;
}

export async function getReadmeHtml(owner: string, repo: string): Promise<string> {
  const url = `${API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`;
  const accept = "application/vnd.github.html";
  const cacheKey = `gh:${accept}:${url}`;

  const cached = getFromCache<string>(cacheKey);
  if (cached) return cached;

  let res: Response;
  try {
    res = await fetch(url, { headers: { Accept: accept } });
  } catch {
    throw new GitHubError("network", "Network error while fetching README");
  }

  if (res.status === 404) {
    throw new GitHubError("not-found", "README not found");
  }

  const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
  if (res.status === 429 || (res.status === 403 && rateLimitRemaining === "0")) {
    throw new GitHubError("rate-limit", "GitHub rate limit exceeded");
  }

  if (!res.ok) {
    throw new GitHubError("network", `Unexpected HTTP status ${res.status}`);
  }

  const text = await res.text();
  setInCache(cacheKey, text);
  return text;
}
