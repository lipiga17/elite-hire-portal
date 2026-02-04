import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'straatix_auth';
const USER_KEY = 'straatix_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedAuth === 'true' && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to restore session:', e);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - in production, this would call an API
    const storedUsers = JSON.parse(localStorage.getItem('straatix_users') || '[]');
    const foundUser = storedUsers.find(u => u.email === email);
    
    if (foundUser && foundUser.password === password) {
      const { password: _, ...userData } = foundUser;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid email or password' };
  };

  const register = async (userData) => {
    // Mock registration - in production, this would call an API
    const storedUsers = JSON.parse(localStorage.getItem('straatix_users') || '[]');
    
    if (storedUsers.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    
    storedUsers.push(newUser);
    localStorage.setItem('straatix_users', JSON.stringify(storedUsers));
    
    const { password: _, confirmPassword: __, ...safeUserData } = newUser;
    setUser(safeUserData);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem(USER_KEY, JSON.stringify(safeUserData));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    // Also update in users list
    const storedUsers = JSON.parse(localStorage.getItem('straatix_users') || '[]');
    const userIndex = storedUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      storedUsers[userIndex] = { ...storedUsers[userIndex], ...updates };
      localStorage.setItem('straatix_users', JSON.stringify(storedUsers));
    }
    
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
