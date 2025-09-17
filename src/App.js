import './App.css';
import { AllRoutes } from './routes/AllRoutes';
import { Header, Footer } from './components';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function App() {
  const location = useLocation();
  
  const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div>
      {!hideHeaderFooter && <Header />}
      <AllRoutes />
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
