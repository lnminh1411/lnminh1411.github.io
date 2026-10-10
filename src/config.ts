export const STATS_HOSTS = {
  stats: "https://lnminh-stats.vercel.app",
  trophy: "https://lnminh-trophy.vercel.app",
  streak: "https://lnminh-streak.vercel.app",
} as const;

export const USERNAME = "lnminh1411";

export function getStatsUrl(username: string = USERNAME): string {
  return `${STATS_HOSTS.stats}/api?username=${encodeURIComponent(username)}&show_icons=true&hide_border=true&bg_color=1e1e2e&title_color=cba6f7&text_color=cdd6f4&icon_color=cba6f7`;
}

export function getTopLangsUrl(username: string = USERNAME): string {
  return `${STATS_HOSTS.stats}/api/top-langs?username=${encodeURIComponent(username)}&layout=compact&langs_count=8&card_width=320&hide_border=true&bg_color=1e1e2e&title_color=cba6f7&text_color=cdd6f4&size_weight=0.5&count_weight=0.5`;
}

export function getTrophyUrl(mobile: boolean = false, username: string = USERNAME): string {
  const colParam = mobile ? "&column=4" : "";
  return `${STATS_HOSTS.trophy}/?username=${encodeURIComponent(username)}&theme=catppuccin_mocha&no-frame=true&no-bg=true&title=Joined2020,Experience,Commits,Issues,PullRequest,Repositories,Followers,Stars${colParam}`;
}

export function getStreakUrl(username: string = USERNAME): string {
  return `${STATS_HOSTS.streak}/?user=${encodeURIComponent(username)}&hide_border=true&background=1E1E2E&ring=CBA6F7&fire=FAB387&currStreakNum=CDD6F4&sideNums=CDD6F4&currStreakLabel=CBA6F7&sideLabels=BAC2DE&dates=A6ADC8&stroke=45475A`;
}
