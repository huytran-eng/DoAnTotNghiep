import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flexGrow: 1 }}>
        <AdminHeader />
        <div style={{ padding: "20px", width: "80%", margin: "0 auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
