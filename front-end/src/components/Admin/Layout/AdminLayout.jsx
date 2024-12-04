import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flexGrow: 1 }}>
        <AdminHeader />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
