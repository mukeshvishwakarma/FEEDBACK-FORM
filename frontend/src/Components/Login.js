import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/Feedbacklist");
    }
  }, []);

  const handleLogin = async () => {
    console.log(username, password);
    let result = await fetch("http://localhost:5000/login", {
      method: "post",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    console.log("result", result.auth);
    console.log("result", result.user);

    if (result.auth) {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.auth));
      navigate("/Feedbacklist");
    } else {
      alert("Please Enter Correct Details");
    }
  };

  return (
    <div className="Login">
      <h1>Login</h1>
      <input
        className="inputBox"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        placeholder="Username"
      />
      <input
        className="inputBox"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <input style={{ width: "316px", backgroundColor: "GrayText"}}
        className="inputBox"
        type="button"
        value="Log In"
        onClick={handleLogin}
      />
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
