import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, BookOpen, User, Users, AlignLeft, Bot, LogOut, Home as HomeIcon, Medal, GraduationCap, CopyCheck, BrainCircuit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { NAV_LINKS } from '../routes/paths';

export default function DashboardLayout() {
  const { role, user } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const getLinks = () => {
    if (role === 'teacher') {
      return [
        { name: 'Bảng Điều Khiển', path: NAV_LINKS.TEACHER_DASHBOARD, icon: HomeIcon },
        { name: 'Bài Giảng', path: NAV_LINKS.LESSONS, icon: BookOpen },
        { name: 'Bài Tập', path: NAV_LINKS.ASSIGNMENTS, icon: CopyCheck },
        { name: 'Lớp Học', path: NAV_LINKS.CLASS_MANAGEMENT, icon: Users },
        { name: 'Học Sinh', path: NAV_LINKS.STUDENT_MANAGEMENT, icon: GraduationCap },
        { name: 'Ngân Hàng Câu Hỏi', path: NAV_LINKS.QUESTION_BANK, icon: AlignLeft },
        { name: 'Trợ Giảng AI', path: NAV_LINKS.AI_ASSISTANT, icon: BrainCircuit },
      ];
    } else { // student
      return [
        { name: 'Bảng Điều Khiển', path: NAV_LINKS.STUDENT_DASHBOARD, icon: HomeIcon },
        { name: 'Bài Giảng Của Tôi', path: NAV_LINKS.LESSONS, icon: BookOpen },
        { name: 'Bài Tập', path: NAV_LINKS.ASSIGNMENTS, icon: CopyCheck },
        { name: 'Trò Chơi', path: NAV_LINKS.QUIZ, icon: Beaker },
        { name: 'Bảng Xếp Hạng', path: NAV_LINKS.LEADERBOARD, icon: Medal },
        { name: 'Gia Sư AI', path: NAV_LINKS.AI_ASSISTANT, icon: Bot },
      ];
    }
  };

  const links = getLinks();

  return (
    <div className="flex shrink-0 h-screen w-full bg-slate-900 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 glass-panel flex flex-col z-20 m-4 rounded-2xl border-white/10"
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <Beaker className="text-brand-blue" size={32} />
          <h2 className="text-2xl font-bold font-sans tracking-tight">
            Chem<span className="text-brand-red">Nexus</span>
          </h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
            const Icon = link.icon;
            
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 text-brand-blue border border-brand-blue/30 shadow-[0_0_15px_rgba(0,229,255,0.1)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-brand-blue' : ''} />
                <span className="font-medium">{link.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-indicator"
                    className="absolute left-0 w-1 h-8 bg-brand-blue rounded-r-md"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
             <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-brand-purple border border-brand-purple/50">
                <User size={20} />
             </div>
             <div className="flex text-sm flex-col overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="font-bold text-white max-w-[120px] overflow-hidden text-ellipsis">{user?.displayName || 'User'}</span>
                <span className="text-xs text-slate-400 max-w-[120px] overflow-hidden text-ellipsis">{user?.email}</span>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Đăng Xuất</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative overflow-y-auto overflow-x-hidden p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
