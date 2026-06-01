// Color-blindness simulation using the Viénot, Brettel & Mollon (1999) model.
// Reference: https://www.researchgate.net/publication/2851554
//
// The flow is sRGB → linear RGB → LMS cone space → apply dichromacy matrix
// → linear RGB → sRGB. The matrices below are the canonical values cited in
// every accessibility tool (Color Oracle, Sim Daltonism, Stark, etc.).

type Vec3 = [number, number, number];
type Mat3 = [Vec3, Vec3, Vec3];

export type CBType = "deuteranopia" | "protanopia" | "tritanopia";

const RGB_TO_LMS: Mat3 = [
  [17.8824, 43.5161, 4.11935],
  [3.45565, 27.1554, 3.86714],
  [0.0299566, 0.184309, 1.46709],
];

const LMS_TO_RGB: Mat3 = [
  [0.080944, -0.130504, 0.116721],
  [-0.010248, 0.054019, -0.113615],
  [-0.000365, -0.00412, 0.693513],
];

const CB_MATRIX: Record<CBType, Mat3> = {
  protanopia: [
    [0, 2.02344, -2.52581],
    [0, 1, 0],
    [0, 0, 1],
  ],
  deuteranopia: [
    [1, 0, 0],
    [0.494207, 0, 1.24827],
    [0, 0, 1],
  ],
  tritanopia: [
    [1, 0, 0],
    [0, 1, 0],
    [-0.395913, 0.801109, 0],
  ],
};

function mul(m: Mat3, v: Vec3): Vec3 {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

function srgbToLinear(c: number): number {
  const n = c / 255;
  return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
}

function linearToSrgb(n: number): number {
  const c = n <= 0.0031308 ? n * 12.92 : 1.055 * Math.pow(n, 1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(c * 255)));
}

function hexToRgb(hex: string): Vec3 {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h.split("").map((c) => c + c).join("")
      : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function rgbToHex([r, g, b]: Vec3): string {
  const hex = (x: number) =>
    Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`.toUpperCase();
}

export function simulate(hex: string, type: CBType): string {
  const [r, g, b] = hexToRgb(hex);
  // The original Viénot model expects sRGB-encoded values directly into the
  // LMS matrix (it bakes the gamma into the matrix). We follow that.
  const lms = mul(RGB_TO_LMS, [r, g, b]);
  const cb = mul(CB_MATRIX[type], lms);
  const rgb = mul(LMS_TO_RGB, cb);
  // Clamp & round.
  return rgbToHex([
    Math.max(0, Math.min(255, rgb[0])),
    Math.max(0, Math.min(255, rgb[1])),
    Math.max(0, Math.min(255, rgb[2])),
  ]);
}

// CIE ΔE*ab — a perceptual color-difference metric. Below ~2.3 two colors
// are considered indistinguishable by a trained observer; below ~5 they are
// hard to tell apart. We use it to check whether semantic state colors
// remain separable under each form of dichromacy.

function srgbToXyz([r, g, b]: Vec3): Vec3 {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  // sRGB D65 → XYZ matrix
  return [
    R * 0.4124564 + G * 0.3575761 + B * 0.1804375,
    R * 0.2126729 + G * 0.7151522 + B * 0.072175,
    R * 0.0193339 + G * 0.119192 + B * 0.9503041,
  ];
}

function xyzToLab([x, y, z]: Vec3): Vec3 {
  // D65 white point.
  const Xn = 0.95047;
  const Yn = 1.0;
  const Zn = 1.08883;
  const f = (t: number) =>
    t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27) * t / 116 + 16 / 116;
  const fx = f(x / Xn);
  const fy = f(y / Yn);
  const fz = f(z / Zn);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

export function hexToLab(hex: string): Vec3 {
  return xyzToLab(srgbToXyz(hexToRgb(hex)));
}

export function deltaE(a: string, b: string): number {
  const [L1, a1, b1] = hexToLab(a);
  const [L2, a2, b2] = hexToLab(b);
  return Math.sqrt((L1 - L2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}

export function lightness(hex: string): number {
  return hexToLab(hex)[0];
}
