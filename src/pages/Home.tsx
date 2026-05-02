import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Leaf, Atom, Beaker, Hexagon } from 'lucide-react';
import { NAV_LINKS } from '../routes/paths';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-20 left-10 text-brand-red/20 animate-pulse-slow">
        <Hexagon size={120} strokeWidth={1} />
      </div>
      <div className="absolute bottom-20 right-10 text-brand-blue/20 animate-bounce-slow">
        <Atom size={150} strokeWidth={1} />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center text-center p-8 glass-panel rounded-3xl max-w-4xl w-full mx-4"
      >
        <div className="flex items-center gap-4 mb-6">
          <Beaker size={48} className="text-brand-blue" />
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Chem<span className="gradient-text">Nexus</span>
          </h1>
        </div>
        
        <p className="text-xl text-slate-300 max-w-2xl mb-12">
          Nền tảng giáo dục tương tác thế hệ mới cho môn Hóa học. 
          Khám phá cấu trúc phân tử 3D, chấm điểm tự động bằng AI và tham gia các trò chơi học tập thú vị.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to={NAV_LINKS.LOGIN} 
              className="flex items-center justify-center w-full sm:w-48 py-4 px-8 rounded-full bg-gradient-to-r from-brand-red to-brand-purple text-white font-bold text-lg shadow-[0_0_20px_rgba(255,51,102,0.4)] hover:shadow-[0_0_30px_rgba(255,51,102,0.6)] transition-shadow"
            >
              Đăng Nhập
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to={NAV_LINKS.REGISTER} 
              className="flex items-center justify-center w-full sm:w-48 py-4 px-8 rounded-full bg-transparent border-2 border-brand-blue text-brand-blue font-bold text-lg hover:bg-brand-blue/10 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.2)]"
            >
              Đăng Ký
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
