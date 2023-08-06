export function getPercentageByMeta(current: number, meta: number) {
  return Number((current * 100) / meta);
}

export function generateSessionCode(): string {
  return `${Math.random().toString(36).substring(2, 10)}:${Date.now()}`;
}
