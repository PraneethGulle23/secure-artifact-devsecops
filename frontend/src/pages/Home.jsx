import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import heroImage from "../assets/hero.png";   // ✅ IMPORTANT

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <div className="home-page">

      {/* HEADER */}
      <header className="home-header">
        <div className="home-header-content">
          <h2 className="logo">SecureArtifact</h2>

          <div>
            {isLoggedIn ? (
              <button className="header-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <button
                  className="header-btn"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="header-btn"
                  onClick={() => navigate("/signup")}
                >
                  Signup
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="home-container">

        <div className="home-left">
          <h1>Secure Multi-Org Artifact Repository</h1>

          <p>
            Encrypt, govern, and control artifact access across multiple organizations with enterprise-grade security.
          </p>

          <button
            className="home-btn"
            onClick={() =>
              navigate(isLoggedIn ? "/dashboard" : "/login")
            }
          >
            Get Started
          </button>
        </div>

        <div className="home-right">
          <div className="home-image-box">
            <img
              src={heroImage}
              alt="Secure Artifact System"
              className="home-hero-image"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;