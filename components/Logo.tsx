interface LogoProps {
  size?: number;
  bgColor?: string;
  className?: string;
}

export default function Logo({ size = 36, bgColor = "#2563EB", className }: LogoProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: size > 32 ? 4 : Math.round(size * 0.25),
        background: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 140 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "78%", height: "auto" }}
      >
        {/* Lacci sinistri */}
        <line x1="6" y1="16" x2="32" y2="16" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="6" y1="40" x2="32" y2="40" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
        {/* Clip */}
        <rect x="32" y="8" width="76" height="40" rx="3.5" fill="white" />
        {/* Fessure */}
        <rect x="41" y="14" width="20" height="28" rx="2.5" fill={bgColor} />
        <rect x="79" y="14" width="20" height="28" rx="2.5" fill={bgColor} />
        {/* Lacci destri */}
        <line x1="108" y1="16" x2="134" y2="16" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
        <line x1="108" y1="40" x2="134" y2="40" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
