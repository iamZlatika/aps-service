import { useTranslation } from "react-i18next";

export const AuthModalBrand = () => {
  const { t } = useTranslation("website");

  return (
    <div className="mb-[22px] flex items-center gap-[11px]">
      <img
        src="/default.png"
        alt="APS service"
        width="40"
        height="40"
        className="h-10 w-auto shrink-0"
      />
      <span>
        <span className="text-[16px] font-bold leading-none tracking-[-0.01em] text-ws-ink">
          APS
          <span className="font-medium text-ws-ink-mute">.service</span>
        </span>
        <small className="mt-[3px] block text-[10px] font-medium uppercase tracking-[.16em] text-ws-ink-mute">
          {t("nav.cabinet")}
        </small>
      </span>
    </div>
  );
};
