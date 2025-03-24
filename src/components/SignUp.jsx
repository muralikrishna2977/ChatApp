// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./SignUp.scss";

// function SignUp() {
//   const [name, setName] = useState(""); 
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   async function handleSubmit(event) {
//     event.preventDefault();

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:3000/signup", { name, email, password });
//       setMessage(response.data.message);
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.message || "An error occurred"); 
//       setMessage("");
//     }
//   }

//   return (
//     <div className="signup">
//       <h2>Sign Up</h2>
//       <form  className="signupform" onSubmit={handleSubmit}>
//         <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
//         <button type="submit">Sign Up</button>
//       </form>

//       <div className="signinpage">
//         <p>Alredy hava an account?</p>
//         <button onClick={() => navigate("/")}>Sign In</button>
//       </div>
      
//       <div className="signupmessage">
//           {message && <p className="successsignup" >{message}</p>}
//           {error && <p className="errorsignup" >{error}</p>}
//       </div>
//     </div>
//   );
// }

// export default SignUp;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignUp.scss";

function SignUp() {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Updated the endpoint to your Railway backend
      const response = await axios.post("https://trial2-production.up.railway.app/signup", { name, email, password });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred"); 
      setMessage("");
    }
  }

  return (
    <div className="signup">
      <h2>Sign Up</h2>
      <form className="signupform" onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
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
        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
        <button type="submit">Sign Up</button>
      </form>

      <div className="signinpage">
        <p>Already have an account?</p>
        <button onClick={() => navigate("/")}>Sign In</button>
      </div>
      
      <div className="signupmessage">
          {message && <p className="successsignup">{message}</p>}
          {error && <p className="errorsignup">{error}</p>}
      </div>
    </div>
  );
}

export default SignUp;
