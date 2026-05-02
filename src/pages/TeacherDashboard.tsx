import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Users, BookOpen, AlertCircle, TrendingUp, Search, Bell, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTeacherDashboardData, seedDatabase } from '../services/db';

export default function TeacherDashboard() {
  const { user, role } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const firstName = user?.displayName?.split(' ')[0] || 'Dr. Teacher';

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const dbData = await getTeacherDashboardData(user.uid);
    setData(dbData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSeed = async () => {
    if (!user) return;
    setSeeding(true);
    await seedDatabase(user.uid, role || 'teacher');
    await loadData();
    setSeeding(false);
  };

  if (loading) {
     return <div className="flex h-[50vh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>;
  }

  const { stats, classes, activities } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-red to-orange-400">
            Chào mừng trở lại, {firstName}!
          </h1>
          <p className="text-slate-400 mt-1">Dưới đây là tổng quan lớp học của bạn hôm nay.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleSeed}
             disabled={seeding}
             className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-full border border-slate-700 transition-colors"
           >
             {seeding ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div> : <Database size={16} />}
             <span className="text-sm font-medium hidden sm:inline">Đặt Lại Dữ Liệu </span>
           </button>
           <button className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-brand-blue hover:border-brand-blue/30 transition-colors relative">
              <Search size={20} />
           </button>
           <button className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-brand-red hover:border-brand-red/30 transition-colors relative">
              <Bell size={20} />
              <div className="absolute top-0 right-0 w-3 h-3 bg-brand-red rounded-full border-2 border-slate-900 animate-pulse"></div>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Tổng Học Sinh', value: stats.totalStudents, icon: Users, color: 'text-blue-400' },
          { label: 'Lớp Đang Hoạt Động', value: stats.activeClasses, icon: BookOpen, color: 'text-purple-400' },
          { label: 'Điểm Trung Bình', value: `${stats.averageScore}%`, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Tỉ Lệ Nộp Bài', value: `${stats.assignmentCompletion}%`, icon: AlertCircle, color: 'text-orange-400' },
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
            <h2 className="text-xl font-bold">Chi Tiết Hiệu Suất Lớp Học</h2>
            <select className="bg-slate-800 border-none text-sm text-slate-300 rounded-lg p-2 outline-none">
               <option>Tất Cả Các Lớp</option>
               <option>Chem 10A1</option>
               <option>AP Chem</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="className" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ff336630', borderRadius: '12px' }}
                  itemStyle={{ color: '#ff3366' }}
                />
                <Bar dataKey="score" fill="#ff3366" radius={[4, 4, 0, 0]} name="Điểm Trung Bình" />
                <Bar dataKey="completion" fill="#00e5ff" radius={[4, 4, 0, 0]} name="% Hoàn Thành" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-2xl flex flex-col"
        >
          <h2 className="text-xl font-bold mb-4 border-b border-slate-700/50 pb-3">Hoạt Động Gần Đây</h2>
          <div className="space-y-4 flex-1">
            {activities.map((act: any) => (
              <div key={act.id} className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-blue flex-shrink-0"></div>
                <div>
                   <p className="text-slate-200 text-sm">
                      <span className="font-bold">{act.student}</span> {act.action}
                   </p>
                   <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
                      <span>{act.class}</span>
                      <span>{act.time}</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
