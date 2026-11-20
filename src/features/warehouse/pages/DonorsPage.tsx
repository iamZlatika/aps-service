import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { warehouseApi } from "@/features/warehouse/api";
import { DonorFormDialog } from "@/features/warehouse/components/donor-form/DonorFormDialog.tsx";
import { DonorsFilterBar } from "@/features/warehouse/components/DonorsFilterBar.tsx";
import { DonorStatusSwitch } from "@/features/warehouse/components/DonorStatusSwitch.tsx";
import { DonorsViewSwitch } from "@/features/warehouse/components/DonorsViewSwitch.tsx";
import { WarehouseTabs } from "@/features/warehouse/components/WarehouseTabs.tsx";
import { useCanManageWarehouse } from "@/features/warehouse/hooks/useCanManageWarehouse.ts";
import {
  DONOR_STATUS_FILTER_KEY,
  DONORS_FILTER_KEYS,
} from "@/features/warehouse/lib/constants.ts";
import { WAREHOUSE_LINKS } from "@/features/warehouse/navigation.ts";
import { buildDonorColumns } from "@/features/warehouse/pages/donors/columns.tsx";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { AddButton } from "@/shared/components/AddButton.tsx";
import { SmartTable } from "@/widgets/table";

const columns = buildDonorColumns();
const api = { getAll: warehouseApi.getDonors };

const DonorsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = useCanManageWarehouse();
  const [isCreating, setIsCreating] = useState(false);

  return (
    <>
      <WarehouseTabs />
      <SmartTable
        titleKey="breadcrumbs.donors"
        api={api}
        queryKeyFn={queryKeys.warehouse.donors}
        columns={columns}
        searchField="search"
        searchPlaceholder="warehouse.search.donors"
        filterBar={
          <div className="flex flex-wrap items-center gap-2">
            <DonorsViewSwitch value="donors" />
            <DonorStatusSwitch />
            <DonorsFilterBar />
          </div>
        }
        extraFilterKeys={[DONOR_STATUS_FILTER_KEY, ...DONORS_FILTER_KEYS]}
        onRowClick={(donor) => navigate(WAREHOUSE_LINKS.donor(donor.id))}
        headerActions={
          canManage ? (
            <AddButton onClick={() => setIsCreating(true)} />
          ) : undefined
        }
      />
      {isCreating && (
        <DonorFormDialog
          defaultLocationId={user?.location?.id ?? null}
          onClose={() => setIsCreating(false)}
          onSaved={(donor) => navigate(WAREHOUSE_LINKS.donor(donor.id))}
        />
      )}
    </>
  );
};

export default DonorsPage;
