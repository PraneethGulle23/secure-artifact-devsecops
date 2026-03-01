import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-10">
        SecureVault
      </h2>

      <Link
        to="/dashboard"
        className="mb-4 hover:bg-gray-700 p-2 rounded-lg"
      >
        Dashboard
      </Link>

      <Link
        to="/upload"
        className="mb-4 hover:bg-gray-700 p-2 rounded-lg"
      >
        Upload Artifact
      </Link>

      <button
        onClick={logout}
        className="mt-auto bg-red-500 hover:bg-red-600 p-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;