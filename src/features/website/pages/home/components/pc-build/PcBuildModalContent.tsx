import { useTranslation } from "react-i18next";

import { ContactModalContent } from "@/features/website/components/ContactModalContent";
import { DEVICE_ICONS } from "@/features/website/components/DeviceIcons";

export const PcBuildModalContent = () => {
  const { t } = useTranslation("website");

  return (
    <ContactModalContent
      icon={DEVICE_ICONS.computers}
      eyebrow={t("pcBuild.eyebrow")}
      title={t("pcBuild.modalTitle")}
      text={t("pcBuild.modalText")}
    />
  );
};
