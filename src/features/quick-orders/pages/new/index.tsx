import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Cog } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { type InfoTableColumn } from "@/features/orders/components/info-table/InfoTable.tsx";
import { LeaveConfirmDialog } from "@/features/orders/components/LeaveConfirmDialog.tsx";
import { OrderTableCard } from "@/features/orders/components/order-table-card/OrderTableCard.tsx";
import { useLeaveGuard } from "@/features/orders/hooks/useLeaveGuard.ts";
import { calcOrderItemTotal } from "@/features/orders/lib/cellFormatters.tsx";
import AddQuickOrderItemModal from "@/features/quick-orders/components/AddQuickOrderItemModal.tsx";
import QuickOrderFormFields from "@/features/quick-orders/components/QuickOrderFormFields.tsx";
import { useAddQuickOrder } from "@/features/quick-orders/hooks/useAddQuickOrder.ts";
import { useQuickOrderFormDefaults } from "@/features/quick-orders/hooks/useQuickOrderFormDefaults.ts";
import {
  type NewQuickOrderFormValues,
  type NewQuickOrderItemSchema,
  type NewQuickOrderSchema,
  newQuickOrderSchema,
} from "@/features/quick-orders/lib/schema.ts";
import { type QuickOrderItemType } from "@/features/quick-orders/types.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card";

type QuickOrderItemRow = NewQuickOrderItemSchema & {
  id: string;
  type: QuickOrderItemType;
  index: number;
};

type ModalState =
  | { mode: "add"; type: QuickOrderItemType }
  | {
      mode: "edit";
      type: QuickOrderItemType;
      index: number;
      item: NewQuickOrderItemSchema;
    }
  | null;

const CreateQuickOrderPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [modalState, setModalState] = useState<ModalState>(null);

  const methods = useForm<
    NewQuickOrderFormValues,
    unknown,
    NewQuickOrderSchema
  >({
    resolver: zodResolver(newQuickOrderSchema()),
    defaultValues: {
      managerId: user?.id,
      services: [],
      products: [],
    },
  });

  const { control, formState } = methods;
  const servicesArray = useFieldArray({ control, name: "services" });
  const productsArray = useFieldArray({ control, name: "products" });

  const { blocker, bypass } = useLeaveGuard(formState.isDirty);
  const { onSubmit, isPending } = useAddQuickOrder(methods.setError, bypass);
  const { users, isLoadingUsers, locations, isLoadingLocations } =
    useQuickOrderFormDefaults(methods.setValue, methods.getValues, user);

  const rows = useMemo(
    () =>
      [
        ...servicesArray.fields.map((field, index) => ({
          ...field,
          type: "service" as const,
          index,
        })),
        ...productsArray.fields.map((field, index) => ({
          ...field,
          type: "product" as const,
          index,
        })),
      ] as QuickOrderItemRow[],
    [servicesArray.fields, productsArray.fields],
  );

  const totalPrice = useMemo(
    () =>
      rows
        .reduce(
          (sum, row) => sum + parseFloat(row.price || "0") * row.quantity,
          0,
        )
        .toFixed(),
    [rows],
  );

  const columns: InfoTableColumn<QuickOrderItemRow>[] = [
    {
      key: "name",
      label: t("quickOrders.orderTable.name"),
      render: (row) => (
        <span className="flex items-center gap-1.5">
          {row.type === "product" ? (
            <Box className="h-4 w-4 shrink-0 text-purple-500" />
          ) : (
            <Cog className="h-4 w-4 shrink-0 text-blue-500" />
          )}
          {row.name}
        </span>
      ),
    },
    {
      key: "quantity",
      label: t("quickOrders.orderTable.quantity"),
    },
    {
      key: "price",
      label: t("quickOrders.orderTable.price"),
    },
    {
      key: "totalPrice",
      label: t("quickOrders.orderTable.totalPrice"),
      render: (row) => calcOrderItemTotal(row.price, row.quantity),
    },
    {
      key: "costOrPurchasePrice",
      label: t("quickOrders.orderTable.costOrPurchasePrice"),
      render: (row) =>
        row.type === "product"
          ? row.purchasePrice || "—"
          : row.costPrice || "—",
    },
  ];

  const handleSaveItem = (values: NewQuickOrderItemSchema) => {
    if (!modalState) return;
    const targetArray =
      modalState.type === "service" ? servicesArray : productsArray;
    if (modalState.mode === "add") {
      targetArray.append(values);
    } else {
      targetArray.update(modalState.index, values);
    }
  };

  const handleDelete = (row: QuickOrderItemRow) => {
    const targetArray = row.type === "service" ? servicesArray : productsArray;
    targetArray.remove(row.index);
  };

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const showNoItemsError = attemptedSubmit && rows.length === 0;

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttemptedSubmit(true);
    if (rows.length === 0) {
      toast.error(t("quickOrders.errors.noItems"));
      return;
    }
    void methods.handleSubmit(onSubmit)(event);
  };

  return (
    <>
      <LeaveConfirmDialog blocker={blocker} />
      <div className="p-2 sm:p-6 max-w-3xl lg:max-w-7xl mx-auto w-full flex flex-col gap-6">
        <h1 className="text-2xl font-bold">{t("quickOrders.createNew")}</h1>
        <FormProvider {...methods}>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            <Card className="p-2 sm:p-6">
              <CardContent>
                <QuickOrderFormFields
                  users={users}
                  isLoadingUsers={isLoadingUsers}
                  locations={locations}
                  isLoadingLocations={isLoadingLocations}
                />
              </CardContent>
            </Card>

            <OrderTableCard
              buttons={[
                {
                  label: t("quickOrders.orderTable.addService"),
                  onClick: () =>
                    setModalState({ mode: "add", type: "service" }),
                },
                {
                  label: t("quickOrders.orderTable.addProduct"),
                  onClick: () =>
                    setModalState({ mode: "add", type: "product" }),
                },
              ]}
              columns={columns}
              data={rows}
              onDelete={handleDelete}
              onRowClick={(row) =>
                setModalState({
                  mode: "edit",
                  type: row.type,
                  index: row.index,
                  item: row,
                })
              }
              getRowKey={(row) => row.id}
              footer={
                <span className="text-sm text-muted-foreground">
                  {t("quickOrders.orderTable.totalPrice")}:{" "}
                  <span className="font-medium text-foreground">
                    {totalPrice} ₴
                  </span>
                </span>
              }
            />
            {showNoItemsError && (
              <p className="text-sm text-destructive">
                {t("quickOrders.errors.noItems")}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {t("quickOrders.actions.create")}
            </Button>
          </form>
        </FormProvider>
      </div>
      {modalState && (
        <AddQuickOrderItemModal
          type={modalState.type}
          open
          onClose={() => setModalState(null)}
          onSave={handleSaveItem}
          editItem={modalState.mode === "edit" ? modalState.item : undefined}
        />
      )}
    </>
  );
};

export default CreateQuickOrderPage;
