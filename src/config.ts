export const STATS_HOSTS = {
  stats: "https://lnminh-stats.vercel.app",
  trophy: "https://lnminh-trophy.vercel.app",
  streak: "https://lnminh-streak.vercel.app",
} as const;

export const USERNAME = "lnminh1411";

export function getStatsUrl(username: string = USERNAME): string {
  return `${STATS_HOSTS.stats}/api?username=${encodeURIComponent(username)}&show_icons=true&hide_border=true&bg_color=020617&title_color=22C55E&text_color=CBD5E1&icon_color=22C55E`;
}

export function getTopLangsUrl(username: string = USERNAME): string {
  return `${STATS_HOSTS.stats}/api/top-langs?username=${encodeURIComponent(username)}&layout=compact&langs_count=8&card_width=320&hide_border=true&bg_color=020617&title_color=22C55E&text_color=CBD5E1`;
}

export function getTrophyUrl(mobile: boolean = false, username: string = USERNAME): string {
  const colParam = mobile ? "&column=4" : "";
  return `${STATS_HOSTS.trophy}/?username=${encodeURIComponent(username)}&theme=matrix&no-frame=true&no-bg=true&title=Joined2020,Experience,Commits,Issues,PullRequest,Repositories,Followers,Stars${colParam}`;
}

export function getStreakUrl(username: string = USERNAME): string {
  return `${STATS_HOSTS.streak}/?user=${encodeURIComponent(username)}&hide_border=true&background=020617&ring=22C55E&fire=22C55E&currStreakNum=F8FAFC&sideNums=F8FAFC&currStreakLabel=22C55E&sideLabels=CBD5E1&dates=94A3B8&stroke=334155`;
}
