import * as DialogPrimitive from "@radix-ui/react-dialog";
import { type ReactNode } from "react";

interface ModalHeaderProps {
  icon: ReactNode;
  eyebrow: string;
  title: string;
}

export const ModalHeader = ({ icon, eyebrow, title }: ModalHeaderProps) => {
  return (
    <div className="flex items-start gap-4 px-7 pb-0 pt-[26px] max-sm:px-5">
      <div
        aria-hidden="true"
        className="flex size-[46px] flex-shrink-0 items-center justify-center rounded-[13px] border border-[color-mix(in_oklab,var(--ws-ember)_26%,transparent)] bg-[color-mix(in_oklab,var(--ws-ember)_14%,transparent)] p-[11px] text-ws-ember-bright [&>svg]:size-full"
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-[7px] text-[11px] font-semibold uppercase tracking-[0.16em] text-ws-ember-bright">
          {eyebrow}
        </p>
        <DialogPrimitive.Title className="text-[22px] font-medium leading-[1.2] tracking-tight text-ws-ink">
          {title}
        </DialogPrimitive.Title>
      </div>
    </div>
  );
};
