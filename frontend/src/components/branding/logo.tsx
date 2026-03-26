type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-10 w-10" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ByteBridgeX logo"
      role="img"
    >
      <rect x="4" y="4" width="56" height="56" rx="18" fill="url(#bg)" />
      <path
        d="M20 18H31C37 18 41 21.5 41 26.5C41 30 39 32.4 35.8 33.6C39.8 34.7 42.5 37.5 42.5 41.8C42.5 47.6 37.8 51 30.5 51H20V18ZM28.8 31C31.9 31 33.8 29.6 33.8 27.1C33.8 24.7 32.1 23.3 28.9 23.3H26.8V31H28.8ZM29.6 45.7C33.2 45.7 35.2 44.1 35.2 41.3C35.2 38.6 33.1 37 29.3 37H26.8V45.7H29.6Z"
        fill="white"
      />
      <path
        d="M38.5 21L46 31.2L53.4 21H57L47.8 33L57 46H53.1L45.7 35.7L38.1 46H34.3L43.8 33L34.7 21H38.5Z"
        fill="#8DE2FF"
      />
      <defs>
        <linearGradient id="bg" x1="10" y1="8" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C5CFF" />
          <stop offset="1" stopColor="#53D1F8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
