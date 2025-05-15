import React, { useState } from 'react';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';

export default function App() {
  const [user, setUser] = useState(null);
  if (!user) return <LoginPage onLogin={setUser} />;
  return <Dashboard user={user} />;
}