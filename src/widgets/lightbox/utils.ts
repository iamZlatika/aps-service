export type LightboxImage = {
  url: string;
  tag?: string;
  tagVariant?: "before" | "after" | "upgrade";
};

export function getTagClass(variant?: string): string {
  if (variant === "after") return "bg-[rgba(93,184,111,.9)] text-[#0e2a16]";
  if (variant === "before") return "bg-[rgba(216,85,62,.85)] text-white";
  return "bg-[rgba(238,122,58,.85)] text-[#2a1a0d]";
}
