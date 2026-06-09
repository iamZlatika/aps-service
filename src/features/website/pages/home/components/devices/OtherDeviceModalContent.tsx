import { useTranslation } from "react-i18next";

import { ContactModalContent } from "@/features/website/components/ContactModalContent";
import { DEVICE_ICONS } from "@/features/website/components/DeviceIcons";

import { type DeviceId } from "./DevicesData";

interface OtherDeviceModalContentProps {
  deviceId: DeviceId;
}

export const OtherDeviceModalContent = ({
  deviceId,
}: OtherDeviceModalContentProps) => {
  const { t } = useTranslation("website");

  return (
    <ContactModalContent
      icon={DEVICE_ICONS[deviceId]}
      eyebrow={t("priceModal.eyebrow")}
      title={t(`devices.items.${deviceId}.name`)}
      text={t("priceModal.otherText")}
    />
  );
};
