/**
 * The six faces of the Multiplr seal cube. The parent sets --sz (cube size),
 * --bw (border width) and --pad, and applies the rotation.
 * The front shows the logo; the sides show icons for what Multiplr does.
 */
export function SealCubeFaces({ xRef }: { xRef?: React.Ref<HTMLElement> }) {
  return (
    <>
      <div className="cube-face bigseal f-front" aria-hidden="true">
        <SealLetters xRef={xRef} />
      </div>
      <div className="cube-face cube-side f-back" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <rect x="2.5" y="8" width="6" height="8" />
          <rect x="15.5" y="8" width="6" height="8" />
          <path d="M9 12h6M12.5 9.5L15 12l-2.5 2.5" />
        </svg>
      </div>
      <div className="cube-face cube-side f-right" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M4 5h16v11H10l-4 3v-3H4z" />
          <path d="M12 8v5M9.5 10.5h5" />
        </svg>
      </div>
      <div className="cube-face cube-side f-left" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <rect x="3" y="6" width="18" height="12" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      </div>
      <div className="cube-face cube-side f-top" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="15" />
          <path d="M3 9h18M8 3v4M16 3v4M7 13h2M11 13h2M15 13h2M7 16h2M11 16h2" />
        </svg>
      </div>
      <div className="cube-face cube-side f-bottom" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" />
          <path d="M3 9h18M3 14h18M9 4v16M15 4v16" />
        </svg>
      </div>
    </>
  );
}

/** The spaced-out M U L / T I P / L R × letters used on the large seal. */
export function SealLetters({ xRef }: { xRef?: React.Ref<HTMLElement> }) {
  return (
    <>
      <span><b>M</b><b>U</b><b>L</b></span>
      <span><b>T</b><b>I</b><b>P</b></span>
      <span><b>L</b><b>R</b><i ref={xRef}>&times;</i></span>
    </>
  );
}
