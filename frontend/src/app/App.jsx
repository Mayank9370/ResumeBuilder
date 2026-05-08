import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "@/shared/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { Provider } from 'react-redux';
import { store } from '@/modules/resume-builder/state/store';
import { Toaster } from 'react-hot-toast';

// Import your existing components
import ResumeBuilder from "@/modules/resume-builder/pages/ResumeBuilder";
import HomePage from "@/modules/home/pages/HomePage";
import MyResumes from "@/modules/resume-builder/pages/MyResumes";
import ResumeLanding from "@/modules/resume-builder/pages/ResumeLanding";
import ResumeDashboard from "@/modules/resume-builder/pages/ResumeDashboard";
import ReferenceResumePreview from "@/modules/resume-builder/pages/ServerResumePreview";
import Login from "@/modules/auth/pages/Login";
import AuthSuccess from "@/modules/auth/pages/AuthSuccess";

import "@/styles/App.css";

// Layout wrapper to conditionally hide Navbar
const Layout = ({ children }) => {
    const location = useLocation();
    const isPreview = location.pathname.startsWith('/preview');
    // HomePage has its own HomeNavbar — suppress the shared Navbar there
    const isHome = location.pathname === '/' || location.pathname === '/templates';
    
    return (
        <div className="min-h-screen bg-gray-50">
            {!isPreview && !isHome && <Navbar />}
            {children}
        </div>
    );
};

function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <Toaster position="top-center" reverseOrder={false} />
        <Router>
          <Layout>
              <Routes>
                  {/* Home — new premium landing page */}
                  <Route path="/" element={<HomePage />} />
                  {/* /templates — alias for the existing ResumeLanding gallery */}
                  <Route path="/templates" element={<ResumeLanding />} />

                  {/* Your existing resume pages */}
                  <Route path="/resume" element={<ResumeLanding />} />
                  <Route path="/resume/builder" element={<ResumeBuilder />} />
                  <Route
                  path="/resume/builder/:resumeId"
                  element={<ResumeBuilder />}
                  />
                  <Route path="/dashboard" element={<ResumeDashboard />} />
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth/success" element={<AuthSuccess />} />

                  <Route path="/preview/:templateId" element={<ReferenceResumePreview />} />
              </Routes>
          </Layout>
        </Router>
      </Provider>
    </AuthProvider>
  );
}

export default App;