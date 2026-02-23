import { Outlet } from "react-router-dom";

const BackofficeLayout = () => {
  return (
    <div className="bg-gray-100">
      <aside>Sidebar</aside>
      <section style={{ flex: 1 }}>
        <Outlet />
      </section>
    </div>
  );
};

export default BackofficeLayout;
