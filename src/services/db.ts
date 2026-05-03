import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';
import { mockStudentStats, mockRecentResults, mockUpcomingAssignments, mockAchievements } from '../data/mockStudentData';
import { mockQuizData } from '../data/mockQuizData';
import { mockTeacherStats, mockClassProgress, mockRecentActivities } from '../data/mockTeacherData';

export const getStudentDashboardData = async (userId: string) => {
  const userStatsRef = doc(db, 'student_stats', userId);
  const userStatsSnap = await getDoc(userStatsRef);
  
  if (!userStatsSnap.exists()) {
    return {
      stats: { streak: 0, currentCourses: 0, averageScore: 0, pendingAssignments: 0, rank: 0 },
      results: [],
      assignments: [],
      achievements: []
    };
  }

  return userStatsSnap.data() as any;
};

export const getTeacherDashboardData = async (userId: string) => {
  const userStatsRef = doc(db, 'teacher_stats', userId);
  const userStatsSnap = await getDoc(userStatsRef);
  
  if (!userStatsSnap.exists()) {
    return {
      stats: { totalStudents: 0, activeClasses: 0, averageScore: 0, assignmentCompletion: 0 },
      classes: [],
      activities: []
    };
  }

  return userStatsSnap.data() as any;
};

export const getQuizData = async () => {
  const quizRef = collection(db, 'quizzes');
  const quizSnap = await getDocs(quizRef);
  if (quizSnap.empty) {
    return [];
  }
  return quizSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
};

export const getLessonData = async (lessonId: string) => {
  const lessonRef = doc(db, 'lessons', lessonId);
  const lessonSnap = await getDoc(lessonRef);
  if (!lessonSnap.exists()) {
     return null;
  }
  return lessonSnap.data();
};

export const mockLessons = [
  {
    id: 1,
    subject: 'Chemistry',
    title: 'Atomic Structure & Electron Configuration',
    description: 'Learn about the intricate arrangement of subatomic particles within an atom. This lesson covers Bohr models, quantum mechanical models, and orbital configurations.',
    videoUrl: 'https://www.youtube.com/embed/cbCor1XpnEE',
    materials: [
      { id: 'm1', name: 'Lecture Slides.pdf', type: 'pdf' },
      { id: 'm2', name: 'Practice Worksheet.docx', type: 'docx' }
    ]
  }
];

export const seedDatabase = async (userId: string, role: string) => {
  try {
    const batch = writeBatch(db);

    if (role === 'student') {
      const statsRef = doc(db, 'student_stats', userId);
      batch.set(statsRef, {
        stats: mockStudentStats,
        results: mockRecentResults,
        assignments: mockUpcomingAssignments,
        achievements: mockAchievements
      });
    } else if (role === 'teacher') {
      const statsRef = doc(db, 'teacher_stats', userId);
      batch.set(statsRef, {
        stats: mockTeacherStats,
        classes: mockClassProgress,
        activities: mockRecentActivities
      });
    }

    // Seed quizzes for everyone
    const quizRef = collection(db, 'quizzes');
    const existingQuizzes = await getDocs(quizRef);
    if (existingQuizzes.empty) {
      mockQuizData.forEach((q) => {
        const qDoc = doc(db, 'quizzes', q.id);
        batch.set(qDoc, q);
      });
    }

    // Seed lessons for everyone
    const lessonsRef = collection(db, 'lessons');
    const existingLessons = await getDocs(lessonsRef);
    if (existingLessons.empty) {
       mockLessons.forEach((l) => {
          const lDoc = doc(db, 'lessons', l.id.toString());
          batch.set(lDoc, l);
       });
    }

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error seeding database: ", error);
    return false;
  }
};
