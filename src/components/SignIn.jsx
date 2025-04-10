import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignIn.scss";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      // Make a POST request to your Railway backend
      const response = await axios.post("https://trial2-production.up.railway.app/signin", { email, password });
      
      if (response.data.message === "Login successful") {
        // Save user data in state and navigate to the chat page
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
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <div className="signnuppage">
        <p>Don't have an account?</p>
        <button onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
      <div className="signinmessage">
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default SignIn;
