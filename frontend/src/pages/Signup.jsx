// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signupUser } from "../services/api";
// import "../styles/form.css";

// function Signup() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     setError("");

//     const res = await signupUser({ name, email, password });

//     if (!res.error) {
//       navigate("/login");
//     } else {
//       setError(res.error);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="form-container">
//         <h2>Create Account</h2>
//         <p className="subtitle">Register to manage your artifacts</p>

//         <input
//           type="text"
//           placeholder="Full Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <input
//           type="email"
//           placeholder="Email address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         {error && <div className="error">{error}</div>}

//         <button onClick={handleSignup}>Signup</button>
//       </div>
//     </div>
//   );
// }

// export default Signup;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/api";
import "../styles/form.css";

function Signup() {
  const [mode, setMode] = useState("create"); // create | join
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const payload =
      mode === "create"
        ? { name, email, password, organizationName }
        : { name, email, password, inviteCode };

    const res = await signupUser(payload);

    if (!res.error) {
      alert(
        mode === "create"
          ? `Organization created! Invite Code: ${res.inviteCode}`
          : "Joined organization successfully"
      );
      navigate("/login");
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2>Create Account</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            type="button"
            onClick={() => setMode("create")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background:
                mode === "create"
                  ? "linear-gradient(to right, #8e2de2, #4a00e0)"
                  : "rgba(255,255,255,0.1)",
              color: "white",
              cursor: "pointer",
            }}
          >
            Create Organization
          </button>

          <button
            type="button"
            onClick={() => setMode("join")}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background:
                mode === "join"
                  ? "linear-gradient(to right, #8e2de2, #4a00e0)"
                  : "rgba(255,255,255,0.1)",
              color: "white",
              cursor: "pointer",
            }}
          >
            Join Organization
          </button>
        </div>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {mode === "create" && (
            <input
              type="text"
              placeholder="Organization Name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />
          )}

          {mode === "join" && (
            <input
              type="text"
              placeholder="Invite Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
          )}

          {error && <div className="error">{error}</div>}

          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;