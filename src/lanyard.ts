export interface SpotifyData {
  track_id: string;
  song: string;
  artist: string;
  album_art_url: string;
  timestamps: {
    start: number;
    end: number;
  };
}

export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export interface Presence {
  discord_status: DiscordStatus;
  active_on_discord_mobile: boolean;
  active_on_discord_desktop: boolean;
  listening_to_spotify: boolean;
  spotify: SpotifyData | null;
  user_id?: string;
}

export const PRIMARY_ID = "783652998319833118";
export const SECONDARY_ID = "1243939761614356544";

const presences = new Map<string, Presence>();
let currentPresence: Presence | null = null;
const listeners = new Set<(p: Presence | null) => void>();

let socket: WebSocket | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let pollingTimer: ReturnType<typeof setInterval> | null = null;
let consecutiveFailures = 0;
let reconnectAttempt = 0;
let isStarted = false;

function notifyListeners(): void {
  const selected = computeSelectedPresence();
  currentPresence = selected;
  for (const listener of listeners) {
    try {
      listener(currentPresence);
    } catch {
      // ignore listener errors
    }
  }
}

function computeSelectedPresence(): Presence | null {
  const primary = presences.get(PRIMARY_ID);
  const secondary = presences.get(SECONDARY_ID);

  if (primary) {
    if (primary.discord_status === "offline" && secondary && secondary.discord_status !== "offline") {
      return secondary;
    }
    return primary;
  }

  return secondary ?? null;
}

async function pollUser(id: string): Promise<void> {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${id}`);
    if (!res.ok) return;
    const json = (await res.json()) as { success: boolean; data: Presence };
    if (json.success && json.data) {
      presences.set(id, json.data);
      notifyListeners();
    }
  } catch {
    // Keep last good state
  }
}

function startPolling(): void {
  if (pollingTimer) return;
  void pollUser(PRIMARY_ID);
  void pollUser(SECONDARY_ID);
  pollingTimer = setInterval(() => {
    void pollUser(PRIMARY_ID);
    void pollUser(SECONDARY_ID);
  }, 15000);
}

function stopPolling(): void {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

function connectWs(): void {
  if (socket) {
    try {
      socket.close();
    } catch {
      // ignore
    }
    socket = null;
  }

  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }

  let ws: WebSocket;
  try {
    ws = new WebSocket("wss://api.lanyard.rest/socket");
    socket = ws;
  } catch {
    handleFailure();
    return;
  }

  ws.onopen = () => {
    reconnectAttempt = 0;
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data as string) as {
        op: number;
        t?: string;
        d: unknown;
      };

      if (data.op === 1) {
        // Hello
        consecutiveFailures = 0;
        stopPolling();
        const hello = data.d as { heartbeat_interval: number };
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        heartbeatTimer = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ op: 3 }));
          }
        }, hello.heartbeat_interval);

        ws.send(
          JSON.stringify({
            op: 2,
            d: {
              subscribe_to_ids: [PRIMARY_ID, SECONDARY_ID],
            },
          })
        );
      } else if (data.op === 0) {
        if (data.t === "INIT_STATE") {
          const map = data.d as Record<string, Presence>;
          for (const [id, pres] of Object.entries(map)) {
            presences.set(id, pres);
          }
          notifyListeners();
        } else if (data.t === "PRESENCE_UPDATE") {
          const pres = data.d as Presence & { user_id?: string; discord_user?: { id: string } };
          const uid = pres.user_id ?? pres.discord_user?.id;
          if (uid) {
            presences.set(uid, pres);
            notifyListeners();
          }
        }
      }
    } catch {
      // ignore malformed message
    }
  };

  socket.onclose = () => {
    handleFailure();
  };

  socket.onerror = () => {
    // onclose will follow
  };
}

function handleFailure(): void {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }

  consecutiveFailures++;
  if (consecutiveFailures >= 2) {
    startPolling();
  }

  const backoff = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
  reconnectAttempt++;

  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(() => {
    connectWs();
  }, backoff);
}

function start(): void {
  if (isStarted) return;
  isStarted = true;
  connectWs();
}

export function subscribe(listener: (p: Presence | null) => void): () => void {
  start();
  listeners.add(listener);
  listener(currentPresence);
  return () => {
    listeners.delete(listener);
  };
}

export function getPresence(): Presence | null {
  return currentPresence;
}
