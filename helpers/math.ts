export function getPercentageByMeta(current: number, meta: number) {
  console.log("current:", current);
  console.log("meta:", meta);
  return Number((current * 100) / meta);
}
