export function getPercentageByMeta(current: number, meta: number) {
  return Number((current * 100) / meta);
}

export function generateSessionCode(): string {
  return `${Math.random().toString(36).substring(2, 10)}:${Date.now()}`;
}

export function getDistanceBetweenCoordinates(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const deltaX = x1 - x2;
  const deltaY = y1 - y2;

  const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

  return distance;
}
