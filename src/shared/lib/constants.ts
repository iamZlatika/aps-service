export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const statusColorMap = {
  red: "bg-red-600",
  fuchsia: "bg-fuchsia-600",
  pink: "bg-pink-600",
  violet: "bg-violet-600",
  blue: "bg-blue-600",
  sky: "bg-sky-600",
  green: "bg-green-600",
  yellow: "bg-yellow-400",
  orange: "bg-orange-600",
  black: "bg-black",
  gray: "bg-gray-400",
} as const;

export const statusTextColorMap = {
  red: "text-white",
  fuchsia: "text-white",
  pink: "text-white",
  violet: "text-white",
  blue: "text-white",
  sky: "text-white",
  green: "text-white",
  yellow: "text-black",
  orange: "text-white",
  black: "text-white",
  gray: "text-black",
} as const;
