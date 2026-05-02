import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { getQuizData } from '../services/db';

export default function Quiz() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const data = await getQuizData();
      setQuestions(data);
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIdx];

  useEffect(() => {
    if (loading || isFinished || isAnswerRevealed || !currentQuestion) return;
    
    if (timeLeft === 0) {
      handleAnswer(null); // Time out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, isAnswerRevealed, loading, currentQuestion]);

  const handleAnswer = (answer: string | null) => {
    if (isAnswerRevealed) return;
    
    setSelectedAnswer(answer);
    setIsAnswerRevealed(true);

    if (answer === currentQuestion.correctAnswer) {
      const timeBonus = Math.floor(timeLeft / 2);
      const comboMultiplier = 1 + (combo * 0.1);
      setScore((prev) => prev + Math.floor((10 + timeBonus) * comboMultiplier));
      setCombo((prev) => prev + 1);
    } else {
      setCombo(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setIsAnswerRevealed(false);
      setSelectedAnswer(null);
      setTimeLeft(20);
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setCombo(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setTimeLeft(20);
    setIsFinished(false);
  };

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>;
  }

  if (questions.length === 0) {
    return <div className="flex h-[50vh] items-center justify-center"><p className="text-slate-400">Không tìm thấy câu hỏi. Giáo viên cần khởi tạo dữ liệu.</p></div>;
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto align-center h-[80vh]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-10 rounded-3xl text-center border-brand-blue/30 w-full relative overflow-hidden"
        >
          {score > 50 && (
            <div className="absolute inset-0 pointer-events-none opacity-20">
               {/* Simplified Confetti Placeholder */}
               <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500 via-transparent to-transparent"></div>
            </div>
          )}
          <h2 className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-teal-400">
            Hoàn Thành Trắc Nghiệm!
          </h2>
          <p className="text-slate-400 mb-8">Cùng xem bạn làm thế nào nhé</p>
          
          <div className="flex justify-center items-center mb-8 gap-8">
            <div className="text-center">
              <p className="text-5xl font-black text-white">{score}</p>
              <p className="text-sm text-slate-400 mt-1 uppercase tracking-wider">Điểm Tổng Kết</p>
            </div>
          </div>

          <button 
            onClick={restart}
            className="flex items-center justify-center gap-2 mx-auto bg-brand-blue text-slate-900 font-bold px-8 py-4 rounded-full text-lg hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all"
          >
            <RotateCcw size={20} /> Chơi Lại
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 py-4">
      {/* HUD */}
      <div className="flex justify-between items-center glass-panel p-4 rounded-2xl border-white/5">
        <div className="flex items-center gap-2">
          <div className="bg-brand-red/20 text-brand-red p-2 rounded-lg">
            <Timer size={20} />
          </div>
          <span className={`text-xl font-bold font-mono ${timeLeft <= 5 ? 'text-brand-red animate-pulse' : 'text-slate-200'}`}>
            00:{timeLeft.toString().padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-1 text-orange-400">
              <Zap size={16} />
              <span className="font-bold">x{combo}</span>
            </div>
            <p className="text-[10px] text-slate-500 uppercase">Liên Hoàn</p>
          </div>
          <div className="text-center">
             <span className="text-2xl font-bold text-white">{score}</span>
             <p className="text-[10px] text-slate-500 uppercase">Điểm</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden border border-slate-700">
        <div 
          className="bg-gradient-to-r from-brand-red to-brand-blue h-2 rounded-full transition-all duration-300" 
          style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuestion.id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="glass-card p-6 md:p-10 rounded-3xl"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-4 block">
            Câu hỏi {currentQuestionIdx + 1} / {questions.length}
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-white leading-tight">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => {
              let btnClass = "bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700/80";
              let icon = null;

              if (isAnswerRevealed) {
                if (option === currentQuestion.correctAnswer) {
                  btnClass = "bg-green-500/20 border-green-500 text-green-300";
                  icon = <CheckCircle size={20} className="text-green-500" />;
                } else if (option === selectedAnswer) {
                  btnClass = "bg-red-500/20 border-red-500 text-red-300";
                  icon = <XCircle size={20} className="text-red-500" />;
                } else {
                  btnClass = "bg-slate-800/30 border-slate-700/50 text-slate-500 opacity-50";
                }
              } else if (option === selectedAnswer) {
                 btnClass = "bg-brand-blue/20 border-brand-blue text-white";
              }

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswerRevealed}
                  className={`relative p-5 rounded-2xl font-medium text-lg text-left transition-all duration-200 flex justify-between items-center ${btnClass} ${!isAnswerRevealed ? 'hover:-translate-y-1 hover:shadow-lg' : ''}`}
                >
                  {option}
                  {icon}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {isAnswerRevealed && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                className="bg-brand-purple/10 border border-brand-purple/30 rounded-2xl p-6"
              >
                <h3 className="font-bold text-brand-purple mb-2">Lời giải thích</h3>
                <p className="text-slate-300">{currentQuestion.explanation}</p>
                
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={nextQuestion}
                    className="flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Câu Tiếp Theo <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
