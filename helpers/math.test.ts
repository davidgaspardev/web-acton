import {
  generateSessionCode,
  getDistanceBetweenCoordinates,
  getPercentageByMeta,
} from "./math";

describe("Math helper", () => {
  it("should return the correct percentage", () => {
    expect(getPercentageByMeta(50, 100)).toBe(50);
  });

  it("should generate a session code", () => {
    const code = generateSessionCode();
    expect(code).toMatch(/^[a-z0-9]{8}:\d+$/);
  });

  it("should return the correct distance between two coordinates", () => {
    expect(getDistanceBetweenCoordinates(0, 0, 3, 4)).toBe(5);
    expect(getDistanceBetweenCoordinates(3, -4, 6, 0)).toBe(5);
    expect(getDistanceBetweenCoordinates(-6, -4, 1, 7)).toBe(13.038404810405298);
  });
});
