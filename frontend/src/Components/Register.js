import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(''); // Initially empty or undefined

  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      let result = await fetch('http://localhost:5000/Register', {
        method: 'post',
        body: JSON.stringify({ username, email, password, confirmPassword, rememberMe }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      result = await result.json();

      if (result.result === 'Username already in use') {
        alert('The username address is already in use. Please try a different username.');
        return;
      }

      if (result.auth) {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', JSON.stringify(result.auth));

        navigate('/');
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="Login">
      <h1>Register</h1>
      <input
        className="inputBox"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        required
        placeholder="Username"
      />
      <input
        className="inputBox"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        placeholder="Email"
      />
      <input
        className="inputBox"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
      />
      <input
        className="inputBox"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm Password"
      />
      <div className="remember_me">
        <input
          type="checkbox"
          className="form-check-input"
          id="exampleCheck1"
          onChange={(e) => setRememberMe(e.target.checked ? 'admin' : '')} // Add 'admin' if checked
        />
        <label className="" htmlFor="exampleCheck1">
          Register As Admin
        </label>
      </div>
      <input
        style={{ width: '316px', backgroundColor: 'GrayText' }}
        className="inputBox"
        type="button"
        value="Register"
        onClick={handleRegister}
      />
      <p>
        Already have an account? <Link to="/">Log In</Link>
      </p>
    </div>
  );
};

export default Register;
