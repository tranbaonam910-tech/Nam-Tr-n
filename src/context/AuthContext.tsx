import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export type UserRole = 'student' | 'teacher' | 'admin' | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ user: null, role: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const docRef = doc(db, 'users', u.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
             setRole(docSnap.data().role as UserRole);
          } else {
             setRole('student');
          }
        } catch (e) {
          console.error('Error fetching role:', e);
          setRole('student');
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={{ user, role, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
