export function parseHexColor(hex: string) {
  const s = hex.trim();

  const m6  = s.match(/^#?(?<r>[A-Fa-f0-9]{2})(?<g>[A-Fa-f0-9]{2})(?<b>[A-Fa-f0-9]{2})$/);
  if (m6?.groups) {
    const { r, g, b } = m6.groups;
    return {
      r: parseInt(r as string, 16),
      g: parseInt(g as string, 16),
      b: parseInt(b as string, 16),
      a: 1
    };
  }

  const m8  = s.match(/^#?(?<r>[A-Fa-f0-9]{2})(?<g>[A-Fa-f0-9]{2})(?<b>[A-Fa-f0-9]{2})(?<a>[A-Fa-f0-9]{2})$/);
  if (m8?.groups) {
    const { r, g, b, a } = m8.groups as { r: string; g: string; b: string; a: string; };
    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16),
      a: parseInt(a, 16) / 255
    };
  }

  const m3  = s.match(/^#?(?<r>[A-Fa-f0-9])(?<g>[A-Fa-f0-9])(?<b>[A-Fa-f0-9])$/);
  if (m3?.groups) {
    const { r, g, b } = m3.groups as { r: string; g: string; b: string; };
    const rr = r + r, gg = g + g, bb = b + b;
    return {
      r: parseInt(rr, 16),
      g: parseInt(gg, 16),
      b: parseInt(bb, 16),
      a: 1
    };
  }

  const m4  = s.match(/^#?(?<r>[A-Fa-f0-9])(?<g>[A-Fa-f0-9])(?<b>[A-Fa-f0-9])(?<a>[A-Fa-f0-9])$/);
  if (m4?.groups) {
    const { r, g, b, a } = m4.groups as { r: string; g: string; b: string; a: string; };
    const rr = r + r, gg = g + g, bb = b + b, aa = a + a;
    return {
      r: parseInt(rr, 16),
      g: parseInt(gg, 16),
      b: parseInt(bb, 16),
      a: parseInt(aa, 16) / 255
    };
  }

  return null;
}
