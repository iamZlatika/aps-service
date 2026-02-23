import { Outlet } from "react-router-dom";

const WebsiteLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <aside>Sidebar</aside>
      <section style={{ flex: 1 }}>
        <Outlet />
      </section>
    </div>
  );
};

export default WebsiteLayout;
