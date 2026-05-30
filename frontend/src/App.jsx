
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import Marketplace from './pages/marketplace/Marketplace';
import CourseDetail from './pages/course/CourseDetail';
import VideoLesson from './pages/course/VideoLesson';
import DiagnosticAssessment from './pages/assessment/DiagnosticAssessment';
import LearningRoadmap from './pages/roadmap/LearningRoadmap';
import CounselingReport from './pages/report/CounselingReport';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CourseManager from './pages/instructor/CourseManager';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background text-text-primary">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/courses" element={<Marketplace />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/learn/:courseId/:lessonId" element={<VideoLesson />} />
              <Route path="/assessment/diagnostic" element={<DiagnosticAssessment />} />
              <Route path="/roadmap" element={<LearningRoadmap />} />
              <Route path="/reports" element={<CounselingReport />} />
              <Route path="/instructor/courses" element={<CourseManager />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
