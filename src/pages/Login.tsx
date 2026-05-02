import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Beaker, Mail, Lock, LogIn, Chrome } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { NAV_LINKS } from '../routes/paths';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await routeUser(userCredential.user.uid);
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await routeUser(result.user.uid);
    } catch (err: any) {
      setError(err.message || 'Đăng nhập bằng Google thất bại');
    } finally {
      setLoading(false);
    }
  };

  const routeUser = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role === 'teacher') navigate(NAV_LINKS.TEACHER_DASHBOARD);
        else navigate(NAV_LINKS.STUDENT_DASHBOARD);
      } else {
        navigate(NAV_LINKS.STUDENT_DASHBOARD);
      }
    } catch (e) {
      navigate(NAV_LINKS.STUDENT_DASHBOARD);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a192f] to-slate-900"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md"
      >
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-brand-blue/30 shadow-[0_0_40px_rgba(0,229,255,0.15)]">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-brand-blue/20 flex items-center justify-center mb-4 border border-brand-blue/50 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Beaker size={32} className="text-brand-blue" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Chào Mừng Trở Lại</h2>
            <p className="text-slate-400 mt-2 text-sm">Đăng nhập để tiếp tục hành trình hóa học của bạn</p>
          </div>

          {error && (
             <div className="mb-4 text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
               {error}
             </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-medium text-slate-300">Mật khẩu</label>
                <a href="#" className="text-xs text-brand-blue hover:text-brand-blue/80 transition-colors">Quên mật khẩu?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-blue text-slate-900 font-bold py-3.5 rounded-xl hover:bg-brand-blue/90 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50 mt-6"
            >
              {loading ? <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div> : <><LogIn size={18} /> Đăng Nhập</>}
            </button>
          </form>

          <div className="mt-6 flex items-center">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">hoặc đăng nhập bằng</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-6 bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <Chrome size={18} /> Google
          </button>

          <p className="mt-8 text-center text-sm text-slate-400">
            Chưa có tài khoản? <Link to={NAV_LINKS.REGISTER} className="text-brand-red font-semibold hover:text-brand-red/80 transition-colors">Đăng ký</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
