export default function Spinner({ size = 18, color = 'currentColor' }) {
  return (
    <svg
      className="km-spinner"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12" cy="12" r="9"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="42"
        strokeDashoffset="14"
        opacity="0.85"
      />
    </svg>
  )
}