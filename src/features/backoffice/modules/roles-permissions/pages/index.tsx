import { useTranslation } from "react-i18next";

import RolePermissionsCard from "@/features/backoffice/modules/roles-permissions/components/RolePermissionsCard.tsx";

const RolesPermissionsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-2 sm:p-6 max-w-5xl mx-auto w-full">
      <h1 className="mb-6 text-2xl font-bold">
        {t("users.roles_permissions.title")}
      </h1>
      <RolePermissionsCard />
    </div>
  );
};

export default RolesPermissionsPage;
