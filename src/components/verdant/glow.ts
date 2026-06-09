/**
 * Additive glow sprites — the luminous look behind EmeraldNight's spore-glows and
 * TeamFireflies' motes, without ctx.shadowBlur (which is slow and muddy). A glow
 * is a pre-rendered radial sprite drawn with globalCompositeOperation 'screen',
 * so overlapping lights *add* and brighten the way real light does. Render the
 * sprite once at seed time, then drawImage per frame — cheap and bright.
 */

export type RGB = [number, number, number];

export function hexToRgb(hex: string, fallback: RGB): RGB {
  const h = hex.replace("#", "").trim();
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16), g = parseInt(h[1] + h[1], 16), b = parseInt(h[2] + h[2], 16);
    return Number.isNaN(r) ? fallback : [r, g, b];
  }
  if (h.length >= 6) {
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return Number.isNaN(r) ? fallback : [r, g, b];
  }
  return fallback;
}

export const rgba = ([r, g, b]: RGB, a: number) => `rgba(${r},${g},${b},${a})`;
const mix = ([r, g, b]: RGB, t: number): RGB => [
  Math.round(r + (255 - r) * t),
  Math.round(g + (255 - g) * t),
  Math.round(b + (255 - b) * t),
];

/** A soft radial light sprite: near-white core → colour → transparent. Size px square. */
export function makeGlowSprite(color: RGB, size = 64): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, rgba(mix(color, 0.7), 1));
  grad.addColorStop(0.25, rgba(color, 0.85));
  grad.addColorStop(0.55, rgba(color, 0.32));
  grad.addColorStop(1, rgba(color, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}
