
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import Marketplace from './pages/marketplace/Marketplace';
import CourseDetail from './pages/course/CourseDetail';
import CourseDiagnostic from './pages/course/CourseDiagnostic';
import VideoLesson from './pages/course/VideoLesson';
import DiagnosticAssessment from './pages/assessment/DiagnosticAssessment';
import LearningRoadmap from './pages/roadmap/LearningRoadmap';
import CounselingReport from './pages/report/CounselingReport';
import Auth from './pages/auth/Auth';
import Onboarding from './pages/auth/Onboarding';
import CourseManager from './pages/instructor/CourseManager';
import InstructorDashboard from './pages/instructor/InstructorDashboard';

import ProtectedRoute from './components/ProtectedRoute';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
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
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/courses" element={<Marketplace />} />
            <Route path="/courses/:id/diagnostic" element={<CourseDiagnostic />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/learn/:courseId/:lessonId" element={<VideoLesson />} />
            <Route path="/assessment/diagnostic" element={<DiagnosticAssessment />} />
            <Route path="/roadmap" element={<LearningRoadmap />} />
            <Route path="/reports" element={<CounselingReport />} />
            
            {/* Instructor Routes */}
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="/instructor/courses" element={<CourseManager />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
