export interface PinnedRepo {
  owner: string;
  repo: string;
  fallbackDescription: string;
}

export const PINNED: readonly PinnedRepo[] = [
  {
    owner: "lnminh1411",
    repo: "ESP32-PC-Control-System",
    fallbackDescription:
      "ESP32-S3 wired into my PC's front-panel header: controls power (with WoL), a rolling door, macros and LCD screens over a webserver.",
  },
  {
    owner: "lnminh1411",
    repo: "P2B-VAIC-Hackathon",
    fallbackDescription:
      "Built in 48 hours for the Vietnam AI Innovation Challenge hackathon.",
  },
  {
    owner: "lnminh1411",
    repo: "local-llm-stack",
    fallbackDescription:
      "Local LLM stack: wake-on-request llama.cpp proxy, agent bridge on DeepSeek Harness, OpenClaw guardrails, ESP32 status feed.",
  },
];
