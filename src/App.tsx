import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UnderwritingFormView from './views/UnderwritingFormView';
import SubmissionConfirmationView from './views/SubmissionConfirmationView';
import DevToolbar from './components/DevToolbar';

function AppHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#502d3c] flex items-center px-6 h-[56px] w-full">
      <div className="flex items-center gap-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-7 h-7"
        >
          <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2" />
          <path
            d="M8 12h8M12 8v8"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-white font-semibold text-[16px] tracking-[0.15px]">
          Rippling
        </span>
      </div>
    </header>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <DevToolbar />
      <AppHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/apply" element={<UnderwritingFormView />} />
          <Route path="/apply/confirmation" element={<SubmissionConfirmationView />} />
          <Route path="*" element={<Navigate to="/apply" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
