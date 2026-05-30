
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Learn from './pages/Learn';
import DiagnosticAssessment from './pages/DiagnosticAssessment';
import Roadmap from './pages/Roadmap';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background text-text-primary">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
            <div className="max-w-[1200px] mx-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/learn/:courseId/:lessonId" element={<Learn />} />
                <Route path="/assessment/diagnostic" element={<DiagnosticAssessment />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
