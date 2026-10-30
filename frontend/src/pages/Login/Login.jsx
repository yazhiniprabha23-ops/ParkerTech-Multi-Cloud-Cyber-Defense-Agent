import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { FaShieldAlt, FaUser, FaLock } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    await signInWithEmailAndPassword(auth, email, password);

    alert("Login Successful!");
    navigate("/dashboard");
  } catch (error) {
    alert("Invalid email or password");
    console.log(error);
  }
};

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="logo">
          <FaShieldAlt className="shield-icon" />
          <h1>ParkerTech Solutions</h1>
          <p>Autonomous Multi-Cloud Cyber Defense Agent</p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="input-box">
            <FaUser />
            <input
               type="email"
               placeholder="Administrator Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <FaLock />
            <input
               type="password"
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
            />
          </div>

          <button type="submit">
            Secure Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;