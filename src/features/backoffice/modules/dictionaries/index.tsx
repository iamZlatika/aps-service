import {
  AlertCircle,
  Container,
  Cpu,
  Factory,
  FolderCog,
  Package,
  ShoppingCart,
  Smartphone,
  Stethoscope,
  StickyNote,
  Wrench,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Card, CardHeader, CardTitle } from "@/shared/components/ui/card";

import { DICTIONARIES_LINKS } from "./navigation";

const DictionariesPage = () => {
  const { t } = useTranslation();

  const dictionaryLinks = [
    {
      title: t("sidebar.dictionaries_list.accessories"),
      icon: Package,
      href: DICTIONARIES_LINKS.accessories(),
    },
    {
      title: t("sidebar.dictionaries_list.issue_types"),
      icon: AlertCircle,
      href: DICTIONARIES_LINKS.issueTypes(),
    },
    {
      title: t("sidebar.dictionaries_list.device_conditions"),
      icon: Stethoscope,
      href: DICTIONARIES_LINKS.deviceConditions(),
    },
    {
      title: t("sidebar.dictionaries_list.device_models"),
      icon: Smartphone,
      href: DICTIONARIES_LINKS.deviceModels(),
    },
    {
      title: t("sidebar.dictionaries_list.device_types"),
      icon: Cpu,
      href: DICTIONARIES_LINKS.deviceTypes(),
    },
    {
      title: t("sidebar.dictionaries_list.intake_notes"),
      icon: StickyNote,
      href: DICTIONARIES_LINKS.intakeNotes(),
    },
    {
      title: t("sidebar.dictionaries_list.manufacturers"),
      icon: Factory,
      href: DICTIONARIES_LINKS.manufacturers(),
    },
    {
      title: t("sidebar.dictionaries_list.repair_operations"),
      icon: Wrench,
      href: DICTIONARIES_LINKS.repairOperations(),
    },
    {
      title: t("sidebar.dictionaries_list.order_statuses"),
      icon: FolderCog,
      href: DICTIONARIES_LINKS.orderStatuses(),
    },
    {
      title: t("sidebar.dictionaries_list.suppliers"),
      icon: Container,
      href: DICTIONARIES_LINKS.suppliers(),
    },
    {
      title: t("sidebar.dictionaries_list.products"),
      icon: ShoppingCart,
      href: DICTIONARIES_LINKS.products(),
    },
  ];

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto w-full">
      <h1 className="mb-6 text-2xl font-bold">
        {t("sidebar.dictionaries_list.title")}
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {dictionaryLinks.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="transition-transform hover:scale-[1.02]"
          >
            <Card className="flex h-full items-center hover:bg-accent hover:text-accent-foreground">
              <CardHeader className="flex flex-row items-center space-x-4 space-y-0 p-4 sm:p-6">
                <div className="rounded-md bg-primary/10 p-2">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-base sm:text-lg">
                  {item.title}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DictionariesPage;
