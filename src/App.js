import ErrorBoundary from './components/ErrorBoundary';
import Router from './Router';
import SkipToMainContent from './components/SkipToMainContent';
import UserProvider from './context/userContext';
import './style/App.css';

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <SkipToMainContent />
        <Router />
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
