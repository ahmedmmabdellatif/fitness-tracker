import React, { useState } from 'react';
const TEST_USER = { email: 'admin@test.com', password: '123456' };
export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === TEST_USER.email && password === TEST_USER.password) {
      onLogin({ email });
    } else {
      setError('Invalid credentials');
    }
  };
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <form onSubmit={handleSubmit} className='bg-white p-8 rounded shadow-md w-full max-w-sm'>
        <h2 className='text-2xl font-bold mb-6 text-center text-blue-600'>Login</h2>
        {error && <div className='text-red-500 mb-4'>{error}</div>}
        <input type='email' placeholder='Email' className='w-full p-2 border rounded mb-4' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type='password' placeholder='Password' className='w-full p-2 border rounded mb-6' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded'>Log In</button>
      </form>
    </div>
  );
}