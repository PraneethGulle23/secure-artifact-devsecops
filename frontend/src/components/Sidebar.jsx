import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = (path) =>
    `block px-5 py-3 rounded-xl transition ${
      location.pathname === path
        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
        : "text-gray-300 hover:bg-white/10"
    }`;

  return (
    <aside className="w-72 p-8 backdrop-blur-xl bg-white/10 border-r border-white/10 flex flex-col">
      <h1 className="text-2xl font-bold mb-12 tracking-wide bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        SecureVault
      </h1>

      <nav className="space-y-4">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          📦 Dashboard
        </Link>

        <Link to="/upload" className={linkClass("/upload")}>
          ⬆ Upload Artifact
        </Link>
      </nav>

      <button
        onClick={logout}
        className="mt-auto bg-red-500/80 hover:bg-red-600 py-3 rounded-xl transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;