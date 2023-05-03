import AuthBar from './components/AuthBar';
import ErrorBoundary from './components/ErrorBoundary';
import ItemsProvider from './context/itemsContext';
import Router from './Router';
import SkipToMainContent from './components/SkipToMainContent';
import UserProvider from './context/userContext';
import './style/App.css';

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <ItemsProvider>
          <SkipToMainContent />
          <AuthBar />
          <Router />
        </ItemsProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
