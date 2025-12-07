import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('netflix_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login - will be replaced with real API call
    const mockUser = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    localStorage.setItem('netflix_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return Promise.resolve(mockUser);
  };

  const signup = (email, password, name) => {
    // Mock signup - will be replaced with real API call
    const mockUser = {
      id: Date.now().toString(),
      email: email,
      name: name || email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    localStorage.setItem('netflix_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return Promise.resolve(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('netflix_user');
    setUser(null);
  };

  const getWatchlist = () => {
    const watchlist = localStorage.getItem(`watchlist_${user?.id}`);
    return watchlist ? JSON.parse(watchlist) : [];
  };

  const addToWatchlist = (item) => {
    if (!user) return;
    const watchlist = getWatchlist();
    const exists = watchlist.find(w => w.id === item.id);
    if (!exists) {
      watchlist.push(item);
      localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(watchlist));
    }
  };

  const removeFromWatchlist = (itemId) => {
    if (!user) return;
    const watchlist = getWatchlist();
    const filtered = watchlist.filter(w => w.id !== itemId);
    localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(filtered));
  };

  const isInWatchlist = (itemId) => {
    if (!user) return false;
    const watchlist = getWatchlist();
    return watchlist.some(w => w.id === itemId);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
