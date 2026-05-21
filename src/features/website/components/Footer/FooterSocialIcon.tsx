import { type ReactNode } from "react";

interface FooterSocialIconProps {
  href: string;
  label: string;
  icon: ReactNode;
}

export const FooterSocialIcon = ({
  href,
  label,
  icon,
}: FooterSocialIconProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="inline-flex size-[34px] items-center justify-center rounded-full border border-ws-line text-ws-ink-soft transition-all duration-200 hover:border-ws-ember hover:text-ws-ember-bright [&>svg]:size-[14px]"
  >
    {icon}
  </a>
);
