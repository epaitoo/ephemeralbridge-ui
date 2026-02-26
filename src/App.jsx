import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Loader2, ShieldAlert, RefreshCw } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import FilesPage from './pages/FilesPage';
import TextsPage from './pages/TextsPage';
import DemoPage from './pages/DemoPage';

function AuthGate({ children }) {
  const { status, error, retry } = useAuth();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
          <p className="text-slate-500 text-sm">Establishing secure session…</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center max-w-sm px-6">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Access error</h1>
            <p className="text-slate-500 text-sm mt-1">{error}</p>
          </div>
          <button onClick={retry} className="btn-primary">
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return children;
}

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
      <AuthProvider>
        <Routes>
          <Route path="demo" element={<DemoPage />} />
          <Route
            path="/*"
            element={
              <AuthGate>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/files" replace />} />
                    <Route path="files" element={<FilesPage />} />
                    <Route path="texts" element={<TextsPage />} />
                  </Route>
                </Routes>
              </AuthGate>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
