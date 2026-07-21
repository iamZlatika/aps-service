import { Plus } from "lucide-react";
import { type ReactNode } from "react";

import {
  InfoTable,
  type InfoTableColumn,
} from "@/features/orders/components/info-table/InfoTable.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import { Card, CardContent } from "@/shared/components/ui/card.tsx";

type OrderTableCardButton = {
  label: string;
  onClick: () => void;
};

interface OrderTableCardProps<T extends { id: string | number }> {
  buttons?: OrderTableCardButton[];
  columns: InfoTableColumn<T>[];
  data: T[];
  onDelete?: (item: T) => void;
  isDeleting?: boolean;
  isUnchangeable?: (item: T) => boolean;
  onRowClick?: (item: T) => void;
  getRowKey?: (row: T) => string | number;
  footer?: ReactNode;
  deleteDialogTitle?: string;
  deleteDialogDescription?: string;
}

export const OrderTableCard = <T extends { id: string | number }>({
  buttons,
  columns,
  data,
  onDelete,
  isDeleting,
  isUnchangeable,
  onRowClick,
  getRowKey,
  footer,
  deleteDialogTitle,
  deleteDialogDescription,
}: OrderTableCardProps<T>) => {
  return (
    <Card>
      <CardContent className="p-2 sm:p-6">
        {buttons && buttons.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {buttons.map((btn) => (
              <Button
                key={btn.label}
                variant="default"
                className="text-base"
                onClick={btn.onClick}
              >
                <Plus size={16} />
                {btn.label}
              </Button>
            ))}
          </div>
        )}
        <InfoTable
          columns={columns}
          data={data}
          onDelete={onDelete}
          isDeleting={isDeleting}
          isUnchangeable={isUnchangeable}
          onRowClick={onRowClick}
          getRowKey={getRowKey}
          footer={footer}
          deleteDialogTitle={deleteDialogTitle}
          deleteDialogDescription={deleteDialogDescription}
        />
      </CardContent>
    </Card>
  );
};
