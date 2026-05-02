import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Play, FileText, Download, CheckCircle, Atom } from 'lucide-react';

import ThreeDViewer from '../components/ThreeDViewer';
import { getLessonData } from '../services/db';

export default function LessonDetail() {
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'video' | '3d' | 'materials'>('video');

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      const data = await getLessonData('1'); // Hardcoded ID for demo
      setLesson(data);
      setLoading(false);
    };
    fetchLesson();
  }, []);

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>;
  }

  if (!lesson) {
     return <div>Không tìm thấy bài học</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-red to-orange-400">
          {lesson.title}
        </h1>
        <p className="text-slate-400 mt-2">{lesson.description}</p>
      </div>

      <div className="flex gap-4 border-b border-slate-700 pb-2">
        <button 
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'video' ? 'bg-brand-red/20 text-brand-red' : 'text-slate-400 hover:text-white'}`}
        >
          <Play size={18} /> Video Bài Giảng
        </button>
        <button 
           onClick={() => setActiveTab('3d')}
           className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === '3d' ? 'bg-brand-blue/20 text-brand-blue' : 'text-slate-400 hover:text-white'}`}
        >
          <Atom size={18} /> Mô Hình 3D
        </button>
        <button 
           onClick={() => setActiveTab('materials')}
           className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'materials' ? 'bg-brand-purple/20 text-brand-purple' : 'text-slate-400 hover:text-white'}`}
        >
          <FileText size={18} /> Tài Liệu Bài Học
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'video' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full aspect-video rounded-2xl overflow-hidden glass-panel border border-white/10"
          >
            <iframe 
              width="100%" 
              height="100%" 
              src={lesson.videoUrl} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </motion.div>
        )}

        {activeTab === '3d' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <ThreeDViewer />
          </motion.div>
        )}

        {activeTab === 'materials' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-4">
            {lesson.materials.map((mat) => (
              <div key={mat.id} className="glass-card p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-800 p-3 rounded-lg text-brand-purple border border-brand-purple/30">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{mat.name}</h3>
                    <p className="text-sm text-slate-400 uppercase">{mat.type}</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-brand-blue/20 hover:text-brand-blue transition-colors text-slate-300">
                  <Download size={20} />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="flex justify-end mt-8">
        <button className="flex items-center gap-2 bg-gradient-to-r from-brand-blue to-teal-400 text-slate-900 font-bold px-6 py-3 rounded-xl hover:opacity-90 shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
          <CheckCircle size={20} /> Hoàn Thành Bài Học
        </button>
      </div>

    </div>
  );
}

// export Atom

