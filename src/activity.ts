import { ACTIVITY_URL } from "./config";

/** PreMiD activity as exposed by lnminh-activity: service name only, no page titles. */
export interface BrowserActivity {
  name: string;
  type: number;
  start: number | null;
  icon?: string | null;
  updated: number;
}

const VERBS: Record<number, string> = { 0: "Using", 1: "Streaming", 2: "Listening to", 3: "Watching", 5: "Competing in" };
const POLL_MS = 20_000;

export function activityVerb(type: number): string {
  return VERBS[type] ?? "Using";
}

export function subscribeActivity(listener: (a: BrowserActivity | null) => void): void {
  let timer: number | undefined;

  async function poll(): Promise<void> {
    try {
      const res = await fetch(ACTIVITY_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const body = (await res.json()) as { activity: BrowserActivity | null };
      listener(body.activity && typeof body.activity.name === "string" ? body.activity : null);
    } catch {
      listener(null);
    }
  }

  function schedule(): void {
    window.clearInterval(timer);
    if (document.visibilityState === "visible") {
      void poll();
      timer = window.setInterval(poll, POLL_MS);
    }
  }

  document.addEventListener("visibilitychange", schedule);
  schedule();
}
