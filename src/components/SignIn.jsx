import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignIn.scss";

import { API_URL } from "../App.jsx";

function SignIn() {
  const [email, setEmail] = useState("ram166@gmail.com");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSigningIn(true); 

    try {
      const response = await axios.post(`${API_URL}/signin`, { email, password });
      
      if (response.data.message === "Login successful") {
        const userData = {
          user_id: response.data.userid,
          name: response.data.name,
          email: response.data.email,
        };
        navigate("/chat", { state: { user: userData } });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred");
      setTimeout(()=>{
        setError("");
      }, 5000);
    } finally{
      setIsSigningIn(false);
    }
  }

  return (
    <div className="signin">
      <h2>Sign In</h2>
      <form className="signinform" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          name="emailid"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={isSigningIn}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={isSigningIn}
        />
        <button className="signInSubmit" type="submit">
          {isSigningIn ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div className="signnuppage">
        <p>Don't have an account?</p>
        <button className="signUpInSignIn" onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
      <div className="signinmessage">
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
 
      <div className="demo-credentials">
        <h4 className="demo-title">Test Users for Demo:</h4>
        <div className="demo-user">
          <span><strong>Email:</strong> <code>ram166@gmail.com</code></span>
          <span><strong>Password:</strong> <code>123</code></span>
        </div>
        <div className="demo-user">
          <span><strong>Email:</strong> <code>hari166@gmail.com</code></span>
          <span><strong>Password:</strong> <code>123</code></span>
        </div>
        <p className="demo-note">
          <em>Use these credentials to log in and test the chat features instantly.</em>
        </p>
      </div>

    </div>
  );
}

export default SignIn;
