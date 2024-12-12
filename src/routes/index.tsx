import { Routes, Route } from 'react-router-dom';
import { DevotionalPage } from '../pages/DevotionalPage';
import { AuthPage } from '../pages/AuthPage';
import { NotesHistoryPage } from '../pages/NotesHistoryPage';
import { PrivateRoute } from './PrivateRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={
        <PrivateRoute>
          <DevotionalPage />
        </PrivateRoute>
      } />
      <Route path="/notes" element={
        <PrivateRoute>
          <NotesHistoryPage />
        </PrivateRoute>
      } />
    </Routes>
  );
}