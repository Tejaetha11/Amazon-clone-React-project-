
import './App.css';
import { AllRoutes } from './routes/AllRoutes';
import { Header, Footer } from './components';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  
  const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div>
      {!hideHeaderFooter && <Header />}
      <AllRoutes />
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;

