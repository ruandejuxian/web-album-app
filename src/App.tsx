import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import GalleryPage from './pages/GalleryPage';
import ProfilePage from './pages/ProfilePage';
import UploadPage from './pages/UploadPage';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/shared/:token" element={<GalleryPage />} />
        </Routes>
      </Layout>
    </ToastProvider>
  );
};

export default App;
