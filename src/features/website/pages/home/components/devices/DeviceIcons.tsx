import { type ReactNode } from "react";

import { type DeviceId } from "@/features/website/pages/home/components/devices/DevicesData";

export const DEVICE_ICONS: Record<DeviceId, ReactNode> = {
  computers: (
    <svg
      viewBox="0 0 80 54"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <rect x="3" y="8" width="36" height="26" rx="2" />
      <path d="M14 38h14M21 34v4" />
      <path d="M44 13h32v18H44z" />
      <path d="M40 31h40l-3 5H43z" fill="currentColor" fillOpacity=".08" />
    </svg>
  ),
  apple: (
    <svg
      viewBox="0 0 80 54"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <rect x="3" y="6" width="42" height="28" rx="3" />
      <path d="M20 38h8M24 34v4" />
      <path
        d="M26 13C26.5 12.2 27.8 11.5 28.5 11.5C28.4 12.6 27.6 13.3 26 13Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M24 15.5C23 15 21.5 14.5 20.5 14.5C18.5 14.5 17.5 16 17.5 18.5C17.5 22.5 19.5 26 22 26.5C23 26.5 23.5 26 24 26C24.5 26 25 26.5 26 26.5C28.5 26 30.5 22.5 30.5 18.5C30.5 16.5 29.5 15.5 29 15.5A4.5 4.5 0 0 0 26 13C25.5 13 24.5 13.5 24 15.5Z"
        fill="currentColor"
        stroke="none"
      />
      <rect x="58" y="14" width="14" height="28" rx="3" />
      <circle cx="65" cy="38" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  displays: (
    <svg
      viewBox="0 0 80 54"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <rect x="4" y="6" width="56" height="32" rx="2" />
      <path d="M22 44h20M32 38v6" />
      <rect x="64" y="16" width="14" height="14" rx="1.5" />
      <path d="M67 34h8M71 30v4" />
    </svg>
  ),
  phones: (
    <svg
      viewBox="0 0 80 54"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <rect x="6" y="6" width="36" height="44" rx="3" />
      <circle cx="24" cy="45" r="1.2" fill="currentColor" stroke="none" />
      <rect x="48" y="14" width="24" height="36" rx="3.5" />
      <path d="M55 19h10" />
      <circle cx="60" cy="45" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  consoles: (
    <svg
      viewBox="0 0 80 54"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <path d="M20 16c-7 0-12 5-12 12s4 14 10 14c3 0 5-2 7-4h14c2 2 4 4 7 4 6 0 10-6 10-14s-5-12-12-12c-3 0-5 1-7 1h-10c-2 0-4-1-7-1z" />
      <path d="M16 26v6M13 29h6" />
      <circle cx="54" cy="26" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="60" cy="32" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="54" cy="38" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="48" cy="32" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="28" cy="36" r="3" />
    </svg>
  ),
  chargers: (
    <svg
      viewBox="0 0 80 54"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <rect x="14" y="6" width="52" height="42" rx="3" />
      <rect x="20" y="12" width="18" height="10" rx="1" />
      <circle cx="50" cy="17" r="3" />
      <circle cx="60" cy="17" r="3" />
      <rect
        x="20"
        y="30"
        width="8"
        height="3"
        rx=".5"
        fill="currentColor"
        stroke="none"
        opacity=".6"
      />
      <rect
        x="31"
        y="30"
        width="8"
        height="3"
        rx=".5"
        fill="currentColor"
        stroke="none"
        opacity=".6"
      />
      <path
        d="M55 28l-4 7h4l-2 6 5-8h-4l1-5z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M28 6v-2h24v2" />
    </svg>
  ),
  other: (
    <svg viewBox="0 0 80 54" fill="none">
      <path
        d="M14 8h52c2 0 4 2 4 4v30c0 2-2 4-4 4H42v3h8v3H30v-3h8v-3H14c-2 0-4-2-4-4V12c0-2 2-4 4-4z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        opacity=".88"
      />
      <text
        x="40"
        y="32"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Manrope, system-ui, sans-serif"
        fill="var(--ws-ember-bright)"
        fontWeight="800"
        fontSize="22"
      >
        ?
      </text>
    </svg>
  ),
};
