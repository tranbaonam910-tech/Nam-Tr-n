import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Book, Award, Target, Flame, TrendingUp, Clock, Database } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStudentDashboardData, seedDatabase } from '../services/db';

export default function StudentDashboard() {
  const { user, role } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  
  const firstName = user?.displayName?.split(' ')[0] || 'Student';

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const dbData = await getStudentDashboardData(user.uid);
    setData(dbData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSeed = async () => {
    if (!user) return;
    setSeeding(true);
    await seedDatabase(user.uid, role || 'student');
    await loadData();
    setSeeding(false);
  };

  if (loading) {
     return <div className="flex h-[50vh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>;
  }

  const { stats, results, assignments, achievements } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-blue-400">
            Chào mừng trở lại, {firstName}!
          </h1>
          <p className="text-slate-400 mt-1">Sẵn sàng khám phá thế giới phân tử hôm nay chưa?</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={handleSeed}
             disabled={seeding}
             className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-full border border-slate-700 transition-colors"
          >
             {seeding ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div> : <Database size={16} />}
             <span className="text-sm font-medium">Đặt Lại Dữ Liệu </span>
          </button>
          <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full border-brand-red/30">
            <Flame className="text-brand-red animate-pulse" size={20} />
            <span className="font-bold text-white pr-2">{stats.streak} Ngày Liên Tiếp</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Khóa Học Hiện Tại', value: stats.currentCourses, icon: Book, color: 'text-blue-400' },
          { label: 'Điểm Trung Bình', value: `${stats.averageScore}%`, icon: Target, color: 'text-green-400' },
          { label: 'Bài Tập Chưa Làm', value: stats.pendingAssignments, icon: Clock, color: 'text-orange-400' },
          { label: 'Xếp Hạng', value: `#${stats.rank}`, icon: Award, color: 'text-brand-purple' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl flex items-center justify-between"
            >
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <Icon size={24} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 glass-card p-6 rounded-2xl flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-brand-blue" size={20} />
              Lịch Sử Học Tập
            </h2>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[...results].reverse()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #00e5ff30', borderRadius: '12px' }}
                  itemStyle={{ color: '#00e5ff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#00e5ff" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-2xl flex flex-col"
        >
          <h2 className="text-xl font-bold mb-4 border-b border-slate-700/50 pb-3">Bài Tập Sắp Tới</h2>
          <div className="space-y-4 flex-1">
            {assignments.map((assignment: any) => (
              <div key={assignment.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-brand-blue/30 transition-colors cursor-pointer group">
                <h3 className="font-semibold text-slate-200 group-hover:text-brand-blue transition-colors">{assignment.title}</h3>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-brand-red">{assignment.due}</span>
                  <span className="text-slate-400">{assignment.course}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 rounded-2xl mt-2"
      >
        <h2 className="text-xl font-bold mb-6">Thành Tích Gần Đây</h2>
        <div className="flex flex-wrap gap-4">
          {achievements.map((ach: any) => (
            <div key={ach.id} className="flex-1 min-w-[200px] p-4 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-white/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(138,43,226,0.2)]">
                {ach.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-200">{ach.title}</h3>
                <p className="text-xs text-slate-400">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
