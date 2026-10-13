const clamp = (value: number) => Math.max(0, Math.min(1, value));
const phase = (progress: number, start: number, end: number) => {
  const value = clamp((progress - start) / (end - start));
  return 1 - (1 - value) ** 3;
};

export function heroAboutMotion(progress: number, width: number, height: number) {
  const value = clamp(progress);
  return {
    radius: Math.hypot(width / 2, height) * phase(value, 0, .42) + (value >= .42 ? 2 : 0),
    title: phase(value, .48, .65),
    portrait: phase(value, .65, .82),
    body: phase(value, .82, .96),
    covered: value >= .42,
  };
}
