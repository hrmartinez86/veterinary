import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { authApi } from '../api/client';
import { clearSession, getStoredUser, onAuthChange, setSession } from '../auth/tokenStorage';

const AuthContext = createContext(null);
const AUTO_REFRESH_MS = 14 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  const stopAutoRefresh = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  const syncSession = session => {
    setSession(session);
    setUser(session.user);
  };

  const refreshSession = async () => {
    const { data } = await authApi.post('/auth/refresh');
    syncSession(data);
    return data.user;
  };

  const login = async credentials => {
    const { data } = await authApi.post('/auth/login', credentials);
    syncSession(data);
    return data.user;
  };

  const logout = async () => {
    stopAutoRefresh();

    try {
      await authApi.post('/auth/logout');
    } catch {
      // ignore logout transport errors
    }

    clearSession();
    setUser(null);
  };

  useEffect(() => {
    let active = true;

    refreshSession()
      .catch(() => {
        clearSession();
        setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      stopAutoRefresh();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      stopAutoRefresh();
      return undefined;
    }

    stopAutoRefresh();
    refreshTimerRef.current = window.setInterval(() => {
      refreshSession().catch(() => {
        clearSession();
        setUser(null);
        stopAutoRefresh();
      });
    }, AUTO_REFRESH_MS);

    return stopAutoRefresh;
  }, [user]);

  useEffect(() => onAuthChange(() => setUser(getStoredUser())), []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshSession, updateSession: syncSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}