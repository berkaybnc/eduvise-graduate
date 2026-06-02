import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import Marketplace from './pages/marketplace/Marketplace';
import CourseDetail from './pages/course/CourseDetail';
import CourseDiagnostic from './pages/course/CourseDiagnostic';
import CourseFinalExam from './pages/course/CourseFinalExam';
import VideoLesson from './pages/course/VideoLesson';
import Leaderboard from './pages/dashboard/Leaderboard';
import DiagnosticAssessment from './pages/assessment/DiagnosticAssessment';
import LearningRoadmap from './pages/roadmap/LearningRoadmap';
import CounselingReport from './pages/report/CounselingReport';
import CodingExercise from './pages/course/CodingExercise';
import Auth from './pages/auth/Auth';
import Onboarding from './pages/auth/Onboarding';
import CourseManager from './pages/instructor/CourseManager';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorProfile from './pages/instructor/InstructorProfile';
import InstructorSettings from './pages/instructor/InstructorSettings';
import InstructorCourseStudents from './pages/instructor/InstructorCourseStudents';
import useAuthStore from './store/authStore';

import ProtectedRoute from './components/ProtectedRoute';

const IndexRedirect = () => {
  const { user } = useAuthStore();
  if (user?.role === 'instructor') {
    return <Navigate to="/instructor/dashboard" />;
  }
  return <Navigate to="/dashboard" />;
};

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-[#0D1117] text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0D1117]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<IndexRedirect />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/courses" element={<Marketplace />} />
            <Route path="/courses/:courseId/exam" element={<CourseFinalExam />} />
            <Route path="/courses/:id/diagnostic" element={<CourseDiagnostic />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/courses/:courseId/coding/:exerciseId" element={<CodingExercise />} />
            <Route path="/learn/:courseId/:lessonId" element={<VideoLesson />} />
            <Route path="/assessment/diagnostic" element={<DiagnosticAssessment />} />
            <Route path="/roadmap" element={<LearningRoadmap />} />
            <Route path="/reports" element={<CounselingReport />} />
            
            {/* Instructor Routes */}
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="/instructor/courses" element={<CourseManager />} />
            <Route path="/instructor/courses/:courseId/students" element={<InstructorCourseStudents />} />
            <Route path="/instructor/settings" element={<InstructorSettings />} />
            <Route path="/instructor/profile" element={<InstructorProfile />} />
            <Route path="/instructor/:id" element={<InstructorProfile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
