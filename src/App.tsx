import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UnderwritingFormView from './views/UnderwritingFormView';
import SubmissionConfirmationView from './views/SubmissionConfirmationView';
import DevToolbar from './components/DevToolbar';

function AppHeader() {
  return (
    <header className="w-full bg-white pt-8 pb-4 px-8">
      <img
        src="https://static-assets.ripplingcdn.com/webapp-static/rippling_logo.svg"
        alt="Rippling"
        className="h-[22px] w-auto"
      />
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
