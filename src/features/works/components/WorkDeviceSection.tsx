import {
  type Control,
  Controller,
  type FieldError,
  type FieldErrors,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { WORK_TYPES } from "@/entities/work/types";
import {
  fetchWorkDeviceModels,
  fetchWorkDeviceTypes,
  fetchWorkManufacturers,
} from "@/features/works/lib/workFetchers";
import { queryKeys } from "@/shared/api/queryKeys";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import SearchableSelect from "@/widgets/searchable-select";

type DeviceFields = {
  device_type: string;
  manufacturer: string;
  device_model: string;
};

type WithWorkType = DeviceFields & { type: string };

interface WorkDeviceSectionProps<T extends FieldValues & DeviceFields> {
  control: Control<T>;
  errors: FieldErrors<T>;
  showWorkType?: boolean;
}

export const WorkDeviceSection = <T extends FieldValues & DeviceFields>({
  control,
  errors,
  showWorkType = true,
}: WorkDeviceSectionProps<T>) => {
  const { t } = useTranslation();

  const deviceErrors = errors as unknown as Partial<
    Record<keyof DeviceFields, FieldError>
  >;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t("works.form.section_device")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {showWorkType && (
          <div className="flex flex-col gap-1.5">
            <Label>{t("works.form.type_key")}</Label>
            <Controller
              control={control as unknown as Control<WithWorkType>}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={
                      (errors as unknown as FieldErrors<WithWorkType>).type
                        ? "border-destructive"
                        : undefined
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={WORK_TYPES.REPAIR}>
                      {t("works.form.type_repair")}
                    </SelectItem>
                    <SelectItem value={WORK_TYPES.UPGRADE}>
                      {t("works.form.type_upgrade")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label>{t("works.form.device_type")}</Label>
            <Controller
              control={control}
              name={"device_type" as Path<T>}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value as string}
                  onChange={field.onChange}
                  fetchItems={fetchWorkDeviceTypes}
                  queryKey={queryKeys.dictionaries.deviceTypes()}
                  placeholder={t("works.form.device_type")}
                  error={deviceErrors.device_type}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>{t("works.form.manufacturer")}</Label>
            <Controller
              control={control}
              name={"manufacturer" as Path<T>}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value as string}
                  onChange={field.onChange}
                  fetchItems={fetchWorkManufacturers}
                  queryKey={queryKeys.dictionaries.manufacturers()}
                  placeholder={t("works.form.manufacturer")}
                  error={deviceErrors.manufacturer}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>{t("works.form.device_model")}</Label>
            <Controller
              control={control}
              name={"device_model" as Path<T>}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value as string}
                  onChange={field.onChange}
                  fetchItems={fetchWorkDeviceModels}
                  queryKey={queryKeys.dictionaries.deviceModels()}
                  placeholder={t("works.form.device_model")}
                  error={deviceErrors.device_model}
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
