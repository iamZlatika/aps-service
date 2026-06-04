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
      <svg
        x="16.27"
        y="11.87"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        overflow="visible"
      >
        <path
          fill="currentColor"
          stroke="none"
          d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
        />
      </svg>
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
      <g
        transform="translate(40 27) scale(1.35) translate(-32 -29)"
        strokeWidth="1.2"
        stroke="currentColor"
        opacity=".88"
      >
        <path d="M20 16c-7 0-12 5-12 12s4 14 10 14c3 0 5-2 7-4h14c2 2 4 4 7 4 6 0 10-6 10-14s-5-12-12-12c-3 0-5 1-7 1h-10c-2 0-4-1-7-1z" />
        <path d="M13 29L19 29M16 26L16 32" />
        <circle cx="48" cy="26" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="51" cy="29" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="48" cy="32" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="45" cy="29" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="32" cy="29" r="2.4" />
      </g>
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
