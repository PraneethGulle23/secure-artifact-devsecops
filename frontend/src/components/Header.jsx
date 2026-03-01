import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/home");
  };

  return (
    <div
      style={{
        height: "60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div style={{ fontWeight: "bold" }}>
        SecureVault Dashboard
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={navBtnStyle}
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/upload")}
          style={navBtnStyle}
        >
          Upload
        </button>

      {role === "admin" && (
        <button
          onClick={() => navigate("/share-requests")}
          style={navBtnStyle}
        >
          Incoming Requests
        </button>
      )}

        <button
          onClick={handleLogout}
          style={{
            ...navBtnStyle,
            background: "crimson",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const navBtnStyle = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(to right, #8e2de2, #4a00e0)",
  color: "white",
  cursor: "pointer",
};

export default Header;