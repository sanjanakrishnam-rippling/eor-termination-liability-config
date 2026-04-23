import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntakeFormView from './views/IntakeFormView';
import ContinueApplicationView from './views/ContinueApplicationView';
import EmailSentView from './views/EmailSentView';
import UnderwritingFormView from './views/UnderwritingFormView';
import SubmissionConfirmationView from './views/SubmissionConfirmationView';
import CountryListView from './views/CountryListView';
import CountryDetailView from './views/CountryDetailView';
import TerminationPoliciesView from './views/TerminationPoliciesView';
import TerminationPolicyDetailView from './views/TerminationPolicyDetailView';
import CreateTerminationPolicyView from './views/CreateTerminationPolicyView';
import TopNav from './components/TopNav';
import DevToolbar from './components/DevToolbar';

function AppHeader() {
  return (
    <header className="w-full bg-white pt-6 pb-3 px-8">
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
      <TopNav />
      <main className="flex-1 flex flex-col bg-[#fafafa]">
        <Routes>
          {/* Countries */}
          <Route path="/countries" element={<CountryListView />} />
          <Route path="/countries/:code" element={<CountryDetailView />} />

          {/* Termination Liability */}
          <Route path="/termination" element={<TerminationPoliciesView />} />
          <Route path="/termination/new" element={<CreateTerminationPolicyView />} />
          <Route path="/termination/:policyId" element={<TerminationPolicyDetailView />} />

          {/* Underwriting */}
          <Route path="/apply" element={<IntakeFormView />} />
          <Route path="/apply/continue" element={<ContinueApplicationView />} />
          <Route path="/apply/email-sent" element={<EmailSentView />} />
          <Route path="/apply/form" element={<UnderwritingFormView />} />
          <Route path="/apply/confirmation" element={<SubmissionConfirmationView />} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/countries" replace />} />
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
