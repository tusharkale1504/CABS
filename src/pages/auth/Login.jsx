import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct named import
import BASE_URL from '../../api/apiConfig';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/api/users/login`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Login successful!');

        // ✅ Save token
        localStorage.setItem('token', data.token);
        console.log(`**********************${data.token}****************************`)

        // ✅ Decode token to get user info
        const decoded = jwtDecode(data.token); // ✅ Named function
        localStorage.setItem('userId', decoded.id);    // Save patient/doctor ID
        localStorage.setItem('role', decoded.role);    // Save user role

        console.log(`User ID from token: ${decoded.id}`);

        // ✅ Navigate based on role
        if (data.user.role === "doctor") {
          navigate("/doctor-dashboard");
        } else if (data.user.role === "patient") {
          navigate("/patient-dashboard");
        }
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Login;
