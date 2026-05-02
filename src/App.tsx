import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { NAV_LINKS } from './routes/paths';
import { ErrorBoundary } from './components/ErrorBoundary';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Quiz from './pages/Quiz';
import LessonDetail from './pages/LessonDetail';
import AIAssistant from './pages/AIAssistant';

// Placeholders for other pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-red to-brand-blue">{title}</h1>
    <p className="text-slate-400 mt-4">This section is under construction.</p>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path={NAV_LINKS.HOME} element={<Home />} />
            <Route path={NAV_LINKS.LOGIN} element={<Login />} />
            <Route path={NAV_LINKS.REGISTER} element={<Register />} />
            
            {/* Protected Routes for Students */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route element={<DashboardLayout />}>
                <Route path={NAV_LINKS.STUDENT_DASHBOARD} element={<StudentDashboard />} />
                <Route path={NAV_LINKS.QUIZ} element={<Quiz />} />
                <Route path={NAV_LINKS.LEADERBOARD} element={<Placeholder title="Leaderboard" />} />
              </Route>
            </Route>

            {/* Protected Routes for Teachers */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
              <Route element={<DashboardLayout />}>
                <Route path={NAV_LINKS.TEACHER_DASHBOARD} element={<TeacherDashboard />} />
                <Route path={NAV_LINKS.STUDENT_DASHBOARD} element={<Navigate to={NAV_LINKS.TEACHER_DASHBOARD} replace />} />
                <Route path={NAV_LINKS.CLASS_MANAGEMENT} element={<Placeholder title="Class Management" />} />
                <Route path={NAV_LINKS.STUDENT_MANAGEMENT} element={<Placeholder title="Student Management" />} />
                <Route path={NAV_LINKS.QUESTION_BANK} element={<Placeholder title="Question Bank" />} />
              </Route>
            </Route>

            {/* Shared Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'teacher']} />}>
              <Route element={<DashboardLayout />}>
                <Route path={NAV_LINKS.LESSONS} element={<LessonDetail />} />
                <Route path={NAV_LINKS.ASSIGNMENTS} element={<Placeholder title="Assignments" />} />
                <Route path={NAV_LINKS.EXAMS} element={<Placeholder title="Exams" />} />
                <Route path={NAV_LINKS.AI_ASSISTANT} element={<AIAssistant />} />
                <Route path={NAV_LINKS.ACCOUNT} element={<Placeholder title="Account Settings" />} />
              </Route>
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Placeholder title="404 Not Found" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
