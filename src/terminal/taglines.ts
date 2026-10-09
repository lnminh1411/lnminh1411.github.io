export const TAGLINES: readonly string[] = [
  "Creating solution for absolutely nothing",
  "Nothing makes sense",
  "Technically good!",
  "≈70% bug free!",
  "Tell your friends about this.",
  "Nice to meet you!",
  "√-1 love you!",
  "12345678 is a bad password!",
  "Have a great day!",
  "There are no real limits, not even the sky!",
  "!false is actually true!",
  "It's not a bug, it's a feature!",
  "If it works, it works.",
  'helloworld("print")',
  'Playing hide and seek with a ";"',
  "How is this working!?",
  "Time wasted creating this: A lot",
  "It's either !Yes or No",
  "If + else = elif",
  "What a pain!",
  "Mobile friendly!",
  "Perfectly balanced!",
  "EMOTIONAL DAMAGE!",
  "Reinforced with galvanized square steel!",
  "＼（〇_ｏ）／",
  "（づ￣3￣）づ╭❤️～",
  "¯\\_(ツ)_/¯",
  "5!=120",
] as const;

export function getRandomTagline(): string {
  const index = Math.floor(Math.random() * TAGLINES.length);
  return TAGLINES[index] ?? "This page isn't working correctly!";
}
