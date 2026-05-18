interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const HamburgerButton = ({ isOpen, onClick }: HamburgerButtonProps) => (
  <button
    type="button"
    aria-label={isOpen ? "Закрити меню" : "Відкрити меню"}
    aria-expanded={isOpen}
    onClick={onClick}
    className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-[var(--ws-line)] text-[var(--ws-ink-hi)] transition-colors duration-200 hover:opacity-70"
  >
    {isOpen ? (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="size-[16px]"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    ) : (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="size-[16px]"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )}
  </button>
);
