/**
 * The official KM Foods mark, inlined so it can be re-coloured for light and
 * dark surfaces. Never stretched: the viewBox keeps the 340:84 lockup ratio.
 */
export const BRAND_LOGO_PATH = "/kmfoods-logo.svg";

export function BrandLogo({
  alt,
  className = "h-9 w-auto",
  variant = "dark",
}: {
  alt: string;
  className?: string;
  variant?: "dark" | "light";
}) {
  const wordmark = variant === "light" ? "#F7F1E7" : "#2B1E14";

  return (
    <svg
      viewBox="0 0 340 84"
      role="img"
      aria-label={alt}
      className={className}
      style={{ direction: "ltr" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="km-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A4121B" />
          <stop offset="0.55" stopColor="#A4121B" />
          <stop offset="0.56" stopColor="#1F3D2B" />
          <stop offset="1" stopColor="#1F3D2B" />
        </linearGradient>
        <clipPath id="km-mark">
          <circle cx="42" cy="42" r="36" />
        </clipPath>
      </defs>

      <circle cx="42" cy="42" r="36" fill="none" stroke="url(#km-ring)" strokeWidth="5" />

      <g clipPath="url(#km-mark)">
        <path
          d="M28 56 C24 44 30 34 42 30 C52 27 58 31 60 37 C61 39 60 41 58 41 C48 39 40 44 37 54 C36 57 33 58 31 56 Z"
          fill="#C81A24"
        />
        <path d="M58 37 C60 33 64 31 67 32 C66 35 63 37 60 38 Z" fill="#1F3D2B" />
        <path d="M26 62 C32 58 42 58 50 63 C44 70 32 70 26 62 Z" fill="#2C5A3F" />
        <path
          d="M28 62 C34 61 42 61 48 63"
          fill="none"
          stroke="#16291D"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <ellipse cx="55" cy="60" rx="3.6" ry="4.6" fill="#C89B3C" />
      </g>

      <text
        x="90"
        y="55"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="38"
        fontWeight="700"
        fill={wordmark}
        letterSpacing="-0.5"
      >
        KM Foods
      </text>
    </svg>
  );
}
