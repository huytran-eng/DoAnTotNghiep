import TeacherHeader from "./TeacherHeader";

const TeacherLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flexGrow: 1 }}>
        <TeacherHeader />
        <div style={{ padding: "20px", width: "80%", margin: "0 auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default TeacherLayout;
