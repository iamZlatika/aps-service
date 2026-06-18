import { useCustomerMe } from "@/features/auth/website/hooks/useCustomerMe";

import { ProfileHeader } from "./components/ProfileHeader";
import { ProfilePanel } from "./components/ProfilePanel";

export const UserProfilePage = () => {
  const { data: customer } = useCustomerMe();

  return (
    <section className="pt-[32px] pb-[56px] max-[880px]:pt-5 max-[880px]:pb-9">
      <div className="ws-wrap">
        <ProfileHeader />

        <ProfilePanel customer={customer} />
      </div>
    </section>
  );
};

export default UserProfilePage;
