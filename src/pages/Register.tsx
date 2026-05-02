import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Atom, Mail, Lock, UserPlus, Chrome, UserCheck } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { NAV_LINKS } from '../routes/paths';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'student'|'teacher'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // save role to db
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        displayName,
        role,
        createdAt: new Date().toISOString()
      });
      navigate(role === 'teacher' ? NAV_LINKS.TEACHER_DASHBOARD : NAV_LINKS.STUDENT_DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName,
        role,
        createdAt: new Date().toISOString()
      }, { merge: true });
      navigate(role === 'teacher' ? NAV_LINKS.TEACHER_DASHBOARD : NAV_LINKS.STUDENT_DASHBOARD);
    } catch (err: any) {
      setError(err.message || 'Đăng ký bằng Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#1a0f14] to-slate-900"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md"
      >
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-brand-red/30 shadow-[0_0_40px_rgba(255,51,102,0.15)]">
          
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-red/20 flex items-center justify-center mb-4 border border-brand-red/50 shadow-[0_0_15px_rgba(255,51,102,0.4)]">
              <Atom size={32} className="text-brand-red" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Tham Gia ChemNexus</h2>
            <p className="text-slate-400 mt-2 text-sm">Tạo tài khoản để bắt đầu khám phá</p>
          </div>

          <div className="flex gap-2 p-1 bg-slate-800/80 rounded-xl mb-6">
            <button 
                type="button"
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'student' ? 'bg-brand-red text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setRole('student')}
            >
                Học Sinh
            </button>
            <button 
                type="button"
               className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'teacher' ? 'bg-brand-red text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setRole('teacher')}
            >
                Giáo Viên
            </button>
          </div>

          {error && (
             <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
               {error}
             </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 ml-1">Họ và Tên</label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 ml-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-red to-rose-500 text-white font-bold py-3.5 rounded-xl hover:opacity-90 hover:shadow-[0_0_20px_rgba(255,51,102,0.4)] transition-all disabled:opacity-50 mt-6 text-lg tracking-wide"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><UserPlus size={18} /> Đăng ký {role === 'student' ? 'Học Sinh' : 'Giáo Viên'}</>}
            </button>
          </form>

          <div className="mt-5 flex items-center">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">hoặc</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-5 bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <Chrome size={18} /> Đăng ký bằng Google
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            Đã có tài khoản? <Link to={NAV_LINKS.LOGIN} className="text-brand-blue font-semibold hover:text-brand-blue/80 transition-colors">Đăng nhập</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
