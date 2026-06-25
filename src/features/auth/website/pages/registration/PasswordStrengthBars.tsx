const STRENGTH_COLORS = ["#d8553e", "#e0a64a", "#c9b24a", "#5fcf78"] as const;

interface PasswordStrengthBarsProps {
  strength: number;
}

export const PasswordStrengthBars = ({
  strength,
}: PasswordStrengthBarsProps) => (
  <div className="mt-[10px] flex gap-[5px]">
    {[0, 1, 2, 3].map((i) => (
      <span
        key={i}
        className="h-[4px] flex-1 rounded-[2px] transition-colors duration-200"
        style={{
          background:
            strength > 0 && i < strength
              ? STRENGTH_COLORS[strength - 1]
              : "var(--ws-line)",
        }}
      />
    ))}
  </div>
);
