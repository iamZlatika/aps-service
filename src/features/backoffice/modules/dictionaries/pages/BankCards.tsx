import { Check, Copy, Lock, Unlock } from "lucide-react";

import { useAuth } from "@/features/auth/backoffice/hooks/useAuth.ts";
import { bankCardsApi } from "@/features/backoffice/modules/dictionaries/api";
import type { BankCardDto } from "@/features/backoffice/modules/dictionaries/api/dto.ts";
import { DictionaryTablePage } from "@/features/backoffice/modules/dictionaries/components/DictionaryTablePage.tsx";
import { useToggleBankCardStatus } from "@/features/backoffice/modules/dictionaries/hooks/useToggleBankCardStatus.ts";
import type { ColumnConfig } from "@/features/backoffice/widgets/table/models/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { Button } from "@/shared/components/ui/button.tsx";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";

const CopyCardNumber = ({ prettyNumber }: { prettyNumber: string }) => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        copy(prettyNumber);
      }}
      className="flex items-center gap-2 text-left"
    >
      <span>{prettyNumber}</span>
      {copied ? (
        <Check className="h-4 w-4 text-green-600 shrink-0" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground shrink-0 transition-colors" />
      )}
    </button>
  );
};

interface BankCardStatusToggleProps {
  card: BankCardDto;
  canManage: boolean;
}

const BankCardStatusToggle = ({
  card,
  canManage,
}: BankCardStatusToggleProps) => {
  const { toggle, isPending } = useToggleBankCardStatus(card);

  const icon = card.is_active ? (
    <Unlock className="h-4 w-4" />
  ) : (
    <Lock className="h-4 w-4" />
  );

  if (!canManage) {
    return (
      <span
        className={card.is_active ? "p-2 text-green-600" : "p-2 text-red-600"}
      >
        {icon}
      </span>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={
        card.is_active
          ? "text-green-600 hover:text-green-700 hover:bg-green-50"
          : "text-red-600 hover:text-red-700 hover:bg-red-50"
      }
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      disabled={isPending}
    >
      {icon}
    </Button>
  );
};

const BankCardsPage = () => {
  const { can } = useAuth();
  const canManage = can("dictionaries_bank_cards_manage");

  const columns: ColumnConfig<BankCardDto>[] = [
    {
      key: "owner_name",
      field: "owner_name",
      labelKey: "dictionaries.table_fields.ownerName",
      sortable: true,
    },
    {
      key: "number",
      field: "number",
      labelKey: "dictionaries.table_fields.cardNumber",
      sortable: false,
      type: "card",
      renderCell: (_, item) => (
        <CopyCardNumber prettyNumber={item.pretty_number} />
      ),
    },
    {
      key: "is_active",
      field: "is_active",
      labelKey: "dictionaries.table_fields.isActive",
      sortable: false,
      formField: false,
      renderCell: (_, item) => (
        <BankCardStatusToggle card={item} canManage={canManage} />
      ),
    },
  ];

  return (
    <DictionaryTablePage
      titleKey="sidebar.dictionaries_list.bank_cards"
      api={bankCardsApi}
      queryKeyFn={queryKeys.dictionaries.bankCards}
      columns={columns}
      searchField="number"
      searchNumbersOnly
      searchPlaceholder="search_placeholders.card_number"
      getItemName={(item) => item.owner_name}
      manageAbility="dictionaries_bank_cards_manage"
    />
  );
};

export default BankCardsPage;
