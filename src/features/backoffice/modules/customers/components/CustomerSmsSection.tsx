import { useTranslation } from "react-i18next";

import { useCustomerSms } from "@/features/backoffice/modules/customers/hooks/useCustomerSms.ts";
import type { CustomerInfo } from "@/features/backoffice/modules/customers/types.ts";
import { CardTitle } from "@/shared/components/ui/card.tsx";
import { Switch } from "@/shared/components/ui/switch.tsx";

interface CustomerSmsSectionProps {
  customer: CustomerInfo;
}

export const CustomerSmsSection = ({ customer }: CustomerSmsSectionProps) => {
  const { t } = useTranslation();
  const { toggleSms, isSmsPending } = useCustomerSms(customer.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <CardTitle className="text-xl font-bold">
          {t("customers.profile.sms_title")}
        </CardTitle>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={customer.smsNotificationsEnabled}
          onCheckedChange={toggleSms}
          disabled={isSmsPending}
          className="data-[state=checked]:bg-blue-500"
        />
        <p className="text-sm text-muted-foreground">
          {t("customers.profile.sms_hint")}
        </p>
      </div>
    </div>
  );
};
