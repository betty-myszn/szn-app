// Holographic die-cut stickers (star, planet, moon) in the Cosmic Co foil with a white sticker edge.
// Never place one on a foil surface: holo on holo loses the edge.

const SHAPES = {
  star: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><polygon points='50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35'/></svg>",
  planet: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='24'/><ellipse cx='50' cy='50' rx='46' ry='12' fill='none' stroke='black' stroke-width='6' transform='rotate(-20 50 50)'/></svg>",
  moon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M62 6a44 44 0 1 0 32 74A36 36 0 0 1 62 6z'/></svg>",
};

export default function HoloShape({ shape, size = 56, style }: { shape: keyof typeof SHAPES; size?: number; style?: React.CSSProperties }) {
  return (
    <span className="holo-shape-wrap" aria-hidden="true" style={style}>
      <span
        className="holo-shape"
        style={{ width: size, height: size, ["--shape" as string]: `url("data:image/svg+xml,${encodeURIComponent(SHAPES[shape])}")` }}
      />
    </span>
  );
}
