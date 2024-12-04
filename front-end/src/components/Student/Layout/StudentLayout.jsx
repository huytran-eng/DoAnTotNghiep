import StudentHeader from "./StudentHeader";

const StudentLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flexGrow: 1 }}>
        <StudentHeader />
        {children}
      </div>
    </div>
  );
};

export default StudentLayout;
