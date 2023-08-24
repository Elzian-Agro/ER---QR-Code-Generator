import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import users from '../users.json'; 
import { useAuth } from '../AuthContext';
import bcrypt from 'bcryptjs';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    const user = users.find(user => user.username === username);

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      setMessage('Login successful');
      login();
      navigate('/qr');
    } else {
      setMessage('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  );
};

export default LoginForm;
