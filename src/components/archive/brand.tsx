export function Seal({ size = 36 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
    >
      <circle cx="24" cy="24" r="21.2" />
      <circle cx="24" cy="24" r="17.9" strokeDasharray="1 3" />
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d="M24 7.8 C20.7 13.3 20.2 18.2 24 22.6 C27.8 18.2 27.3 13.3 24 7.8Z"
          transform={`rotate(${i * 45} 24 24)`}
        />
      ))}
      <circle cx="24" cy="24" r="3.1" fill="currentColor" />
    </svg>
  );
}
export function Brand() {
  return (
    <span className="brand">
      <Seal />
      <span>EPICVERSE</span>
    </span>
  );
}
