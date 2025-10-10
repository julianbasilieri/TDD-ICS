import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { TicketPurchasePage } from './pages/TicketPurchasePage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useEffect } from 'react';
import { userService } from './services/userService';
import { ticketService } from './services/ticketService';
import './App.css'
import '@mantine/dates/styles.css';

function App() {
  useEffect(() => {
    userService.initialize();
    ticketService.initializeAvailability();
  }, []);

  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/registro" element={<AuthPage />} />
        <Route 
          path="/tickets" 
          element={
            <ProtectedRoute>
              <TicketPurchasePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
