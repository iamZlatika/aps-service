import { useCustomerMe } from "@/features/auth/website/hooks/useCustomerMe";

import { AccountHeader } from "./components/AccountHeader";
import { OrdersPanel } from "./components/OrdersPanel";

export const UserAccountPage = () => {
  const { data: customer } = useCustomerMe();

  return (
    <section className="pt-[32px] pb-[56px] max-[880px]:pt-5 max-[880px]:pb-9">
      <div className="ws-wrap">
        <AccountHeader customer={customer} />

        <OrdersPanel customer={customer} />
      </div>
    </section>
  );
};

export default UserAccountPage;
