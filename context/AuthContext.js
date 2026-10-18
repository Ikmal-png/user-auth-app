import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys: one for every registered account, one for the logged-in user.
const USERS_KEY = '@auth/users';
const SESSION_KEY = '@auth/session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // True until we've checked AsyncStorage for a saved session on app start.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(SESSION_KEY);
        if (saved) setUser(JSON.parse(saved));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const getUsers = async () => {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  // Each function resolves to { ok: true } or { ok: false, error } so screens
  // can show the message without needing try/catch.
  const signup = async (name, email, password) => {
    const users = await getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalizedEmail)) {
      return { ok: false, error: 'An account with this email already exists.' };
    }
    // Demo only: a real app would never store plain-text passwords on the device.
    const newUser = { name: name.trim(), email: normalizedEmail, password };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

    const sessionUser = { name: newUser.name, email: newUser.email };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { ok: true };
  };

  const login = async (email, password) => {
    const users = await getUsers();
    const match = users.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password
    );
    if (!match) {
      return { ok: false, error: 'Incorrect email or password.' };
    }
    const sessionUser = { name: match.name, email: match.email };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { ok: true };
  };

  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
