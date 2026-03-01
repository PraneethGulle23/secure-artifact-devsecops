// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import "../styles/form.css";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//   setError("");

//   const res = await loginUser({ email, password });

//   if (res.token) {
//     localStorage.setItem("token", res.token);
//     navigate("/dashboard");
//   } else {
//     setError(res.error);
//   }
// };

//   return (
//     <div style={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       minHeight: "100vh"
//     }}>
//       <div className="form-container">
//         <h2>Login</h2>

//         <form onSubmit={handleLogin}>
//           <input
//             type="email"
//             placeholder="Email"
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button type="submit">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../styles/form.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  const res = await loginUser({ email, password });

  if (res.token) {
  localStorage.setItem("token", res.token);
  localStorage.setItem("role", res.role);
  localStorage.setItem("organizationId", res.organizationId);
  localStorage.setItem("name", res.name);
  navigate("/dashboard");
} else {
    setError(res.error);
  }
};

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2>Sign in</h2>
        <p className="subtitle">Access your secure artifacts</p>

        <form onSubmit={handleLogin}>
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

          {error && <div className="error">{error}</div>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;