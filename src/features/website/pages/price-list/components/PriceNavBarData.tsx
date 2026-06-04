/* eslint-disable react-refresh/only-export-components */
import { type ReactNode } from "react";

export const SIDEBAR_ICONS: Record<string, ReactNode> = {
  computers: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="14" height="10" rx="1.5" />
      <path d="M16 9h6v9H10v-4" />
      <path d="M6 18h6M9 14v4" />
    </svg>
  ),
  android: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M10 5h4" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  iphone: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M10 5h4" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  ipad: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2.5" />
      <circle cx="12" cy="18.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  macbook: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="11" rx="1.5" />
      <path d="M2 19h20l-1.5-2H3.5z" />
    </svg>
  ),
  imac: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="13" rx="2" />
      <path d="M9 20h6M11 16v4" />
    </svg>
  ),
  "tv-monitors": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  "gaming-consoles": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M7 8h10a5 5 0 0 1 5 5 4 4 0 0 1-7 3l-1-1H8l-1 1a4 4 0 0 1-7-3 5 5 0 0 1 5-5z" />
      <path d="M6 11v3M4.5 12.5h3" />
      <circle cx="16" cy="12" r=".8" fill="currentColor" stroke="none" />
      <circle cx="18" cy="14" r=".8" fill="currentColor" stroke="none" />
    </svg>
  ),
  "power-stations": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="16" height="10" rx="2" />
      <path d="M22 11v2" />
      <path d="M11 9l-2 3h3l-2 3" strokeWidth="1.5" />
    </svg>
  ),
};

export const SIDEBAR_DEFAULT_ICON: ReactNode = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M8 19v2M16 19v2" />
  </svg>
);
