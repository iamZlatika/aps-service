interface GoogleSpinnerIconProps {
  className?: string;
  strokeWidth?: number;
  withDot?: boolean;
}

export const GoogleSpinnerIcon = ({
  className = "h-5 w-5",
  strokeWidth = 5,
  withDot = false,
}: GoogleSpinnerIconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path
      d="M24 6 a 18 18 0 0 1 18 18"
      stroke="#4285F4"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M42 24 a 18 18 0 0 1 -18 18"
      stroke="#34A853"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M24 42 a 18 18 0 0 1 -18 -18"
      stroke="#FBBC05"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <path
      d="M6 24 a 18 18 0 0 1 18 -18"
      stroke="#EA4335"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    {withDot && (
      <circle
        cx="24"
        cy="24"
        r="4"
        fill="currentColor"
        className="text-ws-ink-mute opacity-55"
      />
    )}
  </svg>
);
