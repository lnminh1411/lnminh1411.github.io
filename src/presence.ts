import { subscribe, type Presence } from "./lanyard";

export function getVietnamTimeInfo(now: Date = new Date()) {
  const vnParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const getPart = (type: string) => vnParts.find((p) => p.type === type)?.value ?? "00";
  const h24 = getPart("hour");
  const m = getPart("minute");
  const s = getPart("second");
  const clock24 = `${h24}:${m}:${s}`;

  const hNum = parseInt(h24, 10);
  const h12Num = hNum % 12 || 12;
  const h12 = h12Num.toString().padStart(2, "0");
  const ampm = hNum < 12 ? "AM" : "PM";
  const clock12 = `${h12}:${m} ${ampm}`;

  const visitorOffsetMinutes = -now.getTimezoneOffset();
  const vnOffsetMinutes = 420; // UTC+7
  const diffHours = (vnOffsetMinutes - visitorOffsetMinutes) / 60;

  let relative = "same time as you";
  if (diffHours !== 0) {
    const formattedN = parseFloat(Math.abs(diffHours).toFixed(2)).toString();
    relative = diffHours > 0 ? `${formattedN}h ahead of you` : `${formattedN}h behind you`;
  }

  return {
    clock24,
    clock12,
    relative,
    hour: hNum,
    display: `${clock24} · ${clock12} (${relative})`,
  };
}

export function getStatusDetails(presence: Presence | null, vnH: number): { text: string; dotClass: string } {
  if (!presence) {
    return { text: "Status unavailable", dotClass: "bg-offline" };
  }

  const isNight = vnH >= 22 || vnH <= 6;
  const status = presence.discord_status;

  if (presence.listening_to_spotify && status === "online") {
    return { text: "Listening to Spotify", dotClass: "bg-online" };
  }

  if (status === "online") {
    if (presence.active_on_discord_mobile && !presence.active_on_discord_desktop) {
      return { text: "Online on mobile", dotClass: "bg-online" };
    }
    return { text: "Online", dotClass: "bg-online" };
  }

  if (status === "idle") {
    return { text: isNight ? "Sleeping" : "Not active", dotClass: "bg-idle" };
  }

  if (status === "dnd") {
    return { text: isNight ? "Sleeping" : "Busy", dotClass: "bg-danger" };
  }

  return { text: isNight ? "Sleeping" : "Offline", dotClass: "bg-offline" };
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function initPresence(): void {
  const avatarImg = document.getElementById("avatar-img") as HTMLImageElement | null;
  const avatarFallback = document.getElementById("avatar-fallback");
  const dotEl = document.getElementById("presence-dot");
  const statusEl = document.getElementById("presence-status");

  const spotifyCard = document.getElementById("spotify-card");
  const spotifyArt = document.getElementById("spotify-art") as HTMLImageElement | null;
  const spotifyTitle = document.getElementById("spotify-title") as HTMLAnchorElement | null;
  const spotifyArtist = document.getElementById("spotify-artist");
  const spotifyProgress = document.getElementById("spotify-progress");
  const spotifyElapsed = document.getElementById("spotify-elapsed");
  const spotifyTotal = document.getElementById("spotify-total");

  const vnTime24 = document.getElementById("vn-time-24");
  const vnTime12 = document.getElementById("vn-time-12");
  const vnTimeRel = document.getElementById("vn-time-rel");

  if (avatarImg && avatarFallback) {
    avatarImg.addEventListener("error", () => {
      avatarImg.hidden = true;
      avatarFallback.hidden = false;
    });
  }

  let latestPresence: Presence | null = null;
  const startedAt = Date.now();

  function updateClock(): void {
    const timeInfo = getVietnamTimeInfo();
    if (vnTime24) vnTime24.textContent = timeInfo.clock24;
    if (vnTime12) vnTime12.textContent = timeInfo.clock12;
    if (vnTimeRel) vnTimeRel.textContent = timeInfo.relative;

    updatePresenceDisplay(timeInfo.hour);
    updateSpotifyProgress();
  }

  function updatePresenceDisplay(vnH?: number): void {
    const currentVnH = vnH ?? getVietnamTimeInfo().hour;
    const connecting = !latestPresence && Date.now() - startedAt < 10000;
    const details = connecting
      ? { text: "Connecting…", dotClass: "bg-offline" }
      : getStatusDetails(latestPresence, currentVnH);

    if (statusEl) {
      statusEl.textContent = details.text;
    }

    if (dotEl) {
      dotEl.className = `w-2.5 h-2.5 rounded-full shrink-0 ${details.dotClass}`;
    }

    if (latestPresence?.listening_to_spotify && latestPresence.spotify) {
      if (spotifyCard) spotifyCard.hidden = false;
      const sp = latestPresence.spotify;
      if (spotifyArt && spotifyArt.src !== sp.album_art_url) {
        spotifyArt.src = sp.album_art_url;
      }
      if (spotifyTitle) {
        spotifyTitle.textContent = sp.song;
        spotifyTitle.href = `https://open.spotify.com/track/${sp.track_id}`;
      }
      if (spotifyArtist) {
        spotifyArtist.textContent = sp.artist;
      }
    } else {
      if (spotifyCard) spotifyCard.hidden = true;
    }
  }

  function updateSpotifyProgress(): void {
    if (!latestPresence?.listening_to_spotify || !latestPresence.spotify) return;

    const { start, end } = latestPresence.spotify.timestamps;
    const now = Date.now();
    const duration = end - start;

    if (spotifyTotal) {
      spotifyTotal.textContent = formatDuration(duration);
    }

    if (now > end) {
      if (spotifyElapsed) spotifyElapsed.textContent = "--";
      if (spotifyProgress) spotifyProgress.style.transform = "scaleX(1)";
    } else {
      const elapsed = Math.max(0, now - start);
      const ratio = duration > 0 ? Math.max(0, Math.min(1, elapsed / duration)) : 0;
      if (spotifyElapsed) spotifyElapsed.textContent = formatDuration(elapsed);
      if (spotifyProgress) spotifyProgress.style.transform = `scaleX(${ratio})`;
    }
  }

  subscribe((presence) => {
    latestPresence = presence;
    updatePresenceDisplay();
    updateSpotifyProgress();
  });

  updateClock();
  setInterval(updateClock, 1000);
}
