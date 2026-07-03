// App mark: a Persian "س" (seen) in Nastaliq — glyph outline extracted from the
// Gulzar typeface (OFL) — set in warm ivory "ink" on a near-black gradient tile.
// Pure vector: crisp at any size, doubles as the favicon, needs no font load.

const SEEN =
  'M271 -361Q198 -361 149.0 -325.5Q100 -290 75.0 -229.5Q50 -169 50 -95Q50 3 80.0 102.5Q110 202 149 296L181 287Q154 210 130.0 136.5Q106 63 106 -11Q106 -108 162.5 -158.5Q219 -209 306 -209Q409 -209 485.0 -160.5Q561 -112 602 -39Q634 18 650.5 85.0Q667 152 667 224Q667 259 662.0 288.5Q657 318 650 350Q647 364 646.0 374.5Q645 385 645 394Q645 417 653.5 429.0Q662 441 677 448L684 451Q695 429 711.0 419.0Q727 409 743 409Q774 409 798.5 433.0Q823 457 831 492H848Q850 473 859.5 460.0Q869 447 890 447Q919 447 933.0 472.0Q947 497 954 534H972Q972 487 958.0 446.5Q944 406 921.0 382.0Q898 358 870 358Q849 358 828 368Q811 345 783.5 328.0Q756 311 726 311Q720 311 715 312Q712 176 685.0 61.5Q658 -53 598 -152Q563 -211 513.5 -258.5Q464 -306 403.0 -333.5Q342 -361 271 -361Z'

export function Logo({ className = 'logo' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      role="img"
      aria-label="StoryType"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="st-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#282833" />
          <stop offset="0.55" stopColor="#14141b" />
          <stop offset="1" stopColor="#08080b" />
        </linearGradient>
        <linearGradient id="st-ink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d7dcff" />
        </linearGradient>
        <radialGradient id="st-glow" cx="0.3" cy="0.2" r="0.9">
          <stop offset="0" stopColor="#7c8cff" stopOpacity="0.28" />
          <stop offset="0.6" stopColor="#7c8cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="26" fill="url(#st-tile)" />
      <rect width="100" height="100" rx="26" fill="url(#st-glow)" />
      <rect
        x="0.75"
        y="0.75"
        width="98.5"
        height="98.5"
        rx="25.25"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.07"
      />
      <g transform="translate(9.1 54) scale(0.08 -0.08)">
        <path d={SEEN} fill="url(#st-ink)" />
      </g>
    </svg>
  )
}
