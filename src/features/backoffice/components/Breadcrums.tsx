import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";

// Маппинг сегмента URL → ключ i18n
const SEGMENT_LABELS: Record<string, string> = {
  backoffice: "breadcrumbs.home",
  orders: "breadcrumbs.orders",
  customers: "breadcrumbs.customers",
  users: "breadcrumbs.users",
  dictionaries: "breadcrumbs.dictionaries",
  accessories: "breadcrumbs.accessories",
  "device-conditions": "breadcrumbs.deviceConditions",
  "issue-types": "breadcrumbs.issueTypes",
  "device-models": "breadcrumbs.deviceModels",
  "device-types": "breadcrumbs.deviceTypes",
  "intake-notes": "breadcrumbs.intakeNotes",
  manufacturers: "breadcrumbs.manufacturers",
  "repair-operations": "breadcrumbs.repairOperations",
};

export const Breadcrumbs = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  // Разбиваем путь на сегменты, убираем пустые
  const segments = pathname.split("/").filter(Boolean);

  // Не показываем крошки если мы на корне бекофиса
  if (segments.length <= 1) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const path = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          const labelKey = SEGMENT_LABELS[segment];

          // Пропускаем сегменты без маппинга (например, динамические id)
          if (!labelKey) return null;

          return (
            <Fragment key={path}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{t(labelKey)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={path}>{t(labelKey)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
