const SHADE_MAP: Record<string, string> = {
  "#58CC02": "#58A700", // green
  "#1CB0F6": "#1899D6", // blue
  "#FF9600": "#E08600", // orange
  "#CE82FF": "#A568CC", // purple
  "#2B70C9": "#1D5A9E", // teal-blue
  "#FF86D0": "#E066B0", // pink
  "#4B4B4B": "#333333", // charcoal
};

export function shade(hex: string): string {
  return SHADE_MAP[hex] || hex;
}