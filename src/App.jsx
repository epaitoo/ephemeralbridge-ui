import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import FilesPage from './pages/FilesPage';
import TextsPage from './pages/TextsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/files" replace />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="texts" element={<TextsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
