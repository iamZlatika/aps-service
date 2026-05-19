import { useTranslation } from "react-i18next";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const HamburgerButton = ({ isOpen, onClick }: HamburgerButtonProps) => {
  const { t } = useTranslation("website");

  return (
    <button
      type="button"
      aria-label={isOpen ? t("nav.closeMenu") : t("nav.openMenu")}
      aria-expanded={isOpen}
      onClick={onClick}
      className="inline-flex size-ws-ctrl items-center justify-center rounded-ws-ctrl border border-ws-line text-ws-ink-hi transition-colors duration-200 hover:opacity-70"
    >
      {isOpen ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-4"
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
          className="size-4"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </button>
  );
};
