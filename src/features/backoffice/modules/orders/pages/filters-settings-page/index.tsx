import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  locationApi,
  orderStatusesApi,
} from "@/features/backoffice/modules/dictionaries/api";
import { useOrderSearchPresets } from "@/features/backoffice/modules/orders/hooks/useOrderSearchPresets.ts";
import { usersApi } from "@/features/backoffice/modules/users/api";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useLocalizedName } from "@/shared/hooks/useLocalizedName.ts";

import { AddFilterModal } from "./AddFilterModal.tsx";
import { type PresetDisplayMaps, PresetItem } from "./PresetItem.tsx";

const FiltersSettingsPage = () => {
  const { t } = useTranslation();
  const getLocalizedName = useLocalizedName();
  const { presets, deletePreset, isDeleting, reorderPresets } =
    useOrderSearchPresets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderedIds, setOrderedIds] = useState<number[]>(() =>
    presets.map((p) => p.id),
  );

  useEffect(() => {
    setOrderedIds(presets.map((p) => p.id));
  }, [presets]);

  const orderedPresets = useMemo(
    () =>
      orderedIds
        .map((id) => presets.find((p) => p.id === id))
        .filter(Boolean) as typeof presets,
    [orderedIds, presets],
  );

  const { data: statusesData } = useQuery({
    queryKey: queryKeys.dictionaries.orderStatuses(),
    queryFn: () => orderStatusesApi.getAll(1, 100),
  });

  const { data: locationsData } = useQuery({
    queryKey: queryKeys.dictionaries.locations(),
    queryFn: () => locationApi.getAll(1, 100),
  });

  const { data: usersData } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => usersApi.getAll(1, 100),
  });

  const maps: PresetDisplayMaps = useMemo(
    () => ({
      statusMap: new Map(
        statusesData?.items.map((s) => [
          s.id,
          getLocalizedName({ nameRu: s.name_ru, nameUa: s.name_ua }),
        ]) ?? [],
      ),
      locationMap: new Map(
        locationsData?.items.map((l) => [l.id, l.name]) ?? [],
      ),
      managerMap: new Map(usersData?.items.map((u) => [u.id, u.name]) ?? []),
    }),
    [statusesData, locationsData, usersData, getLocalizedName],
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrderedIds((prev) => {
      const oldIndex = prev.indexOf(Number(active.id));
      const newIndex = prev.indexOf(Number(over.id));
      const next = arrayMove(prev, oldIndex, newIndex);
      reorderPresets(next);
      return next;
    });
  };

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {t("orders.filterSettings.presets")}
          </h1>
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {t("orders.filterSettings.addPreset")}
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            {presets.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                {t("orders.filterSettings.noPresets")}
              </p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={orderedIds}
                  strategy={verticalListSortingStrategy}
                >
                  {orderedPresets.map((preset) => (
                    <PresetItem
                      key={preset.id}
                      preset={preset}
                      onDelete={deletePreset}
                      isDeleting={isDeleting}
                      maps={maps}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>

      <AddFilterModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default FiltersSettingsPage;
