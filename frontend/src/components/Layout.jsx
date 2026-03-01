import Header from "./Header";

function Layout({ children }) {
  return (
    <div>
      <Header />
      <div style={{ padding: "40px" }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;

// 
// import Sidebar from "./Sidebar";
// import "../styles/layout.css";

// const Layout = () => {
//   return (
//     <div className="app-layout">
//       <Sidebar />
//       <div className="main-content">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default Layout;