/** Hand-drawn style sketches for each service. They draw in when given `.drawn`. */

export function AiSketch() {
  return (
    <>
      <rect className="dr" pathLength="1" x="30" y="40" width="340" height="300" />
      <path className="dr" pathLength="1" d="M30 82h340" />
      <path className="dr" pathLength="1" d="M60 112h170v44H86l-26 18z" />
      <path className="dr" pathLength="1" d="M340 188H170v60h144l26 18z" />
      <path className="dr" pathLength="1" d="M190 208h120M190 228h80" />
      <path className="dr" pathLength="1" d="M80 130h120M80 142h70" />
      <path className="dr" pathLength="1" d="M60 294h250v26H60z" />
      <path className="dr" pathLength="1" d="M332 307l14-8v16z" />
      <circle className="fill" cx="78" cy="61" r="4" />
      <circle className="fill" cx="94" cy="61" r="4" />
      <path className="dr" pathLength="1" d="M92 262v-22M81 251h22" />
    </>
  );
}

export function WebSketch() {
  return (
    <>
      <rect className="dr" pathLength="1" x="30" y="40" width="340" height="310" />
      <path className="dr" pathLength="1" d="M30 78h340" />
      <path className="dr" pathLength="1" d="M120 59h200" />
      <path className="dr" pathLength="1" d="M60 110h180M60 132h140" />
      <path className="dr" pathLength="1" d="M60 158h92v30H60z" />
      <rect className="dr" pathLength="1" x="60" y="220" width="84" height="100" />
      <rect className="dr" pathLength="1" x="158" y="220" width="84" height="100" />
      <rect className="dr" pathLength="1" x="256" y="220" width="84" height="100" />
      <path className="dr" pathLength="1" d="M270 104l50 50M320 104l-50 50" />
      <circle className="fill" cx="50" cy="59" r="4" />
      <circle className="fill" cx="66" cy="59" r="4" />
      <circle className="fill" cx="82" cy="59" r="4" />
    </>
  );
}

export function FlowSketch() {
  return (
    <>
      <rect className="dr" pathLength="1" x="30" y="70" width="90" height="70" />
      <rect className="dr" pathLength="1" x="160" y="70" width="90" height="70" />
      <rect className="dr" pathLength="1" x="290" y="70" width="80" height="70" />
      <path className="dr" pathLength="1" d="M120 105h40M150 97l10 8-10 8" />
      <path className="dr" pathLength="1" d="M250 105h40M280 97l10 8-10 8" />
      <path className="dr" pathLength="1" d="M330 140v70H205v40" />
      <rect className="dr" pathLength="1" x="150" y="250" width="110" height="80" />
      <path className="dr" pathLength="1" d="M150 290H75V140" />
      <path className="dr" pathLength="1" d="M67 150l8-10 8 10" />
      <path className="dr" pathLength="1" d="M186 290l14 14 26-30" />
    </>
  );
}
