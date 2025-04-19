import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';

// Import pages and components as needed
const App: React.FC = () => {
  return (
    <Router basename="/web-album-app">
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Your app content will go here */}
          <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
              Web Album Ảnh
            </h1>
            <div className="max-w-2xl mx-auto">
              {/* This is where your routes would normally go */}
              <Routes>
                <Route path="/" element={<div>Trang chủ</div>} />
                {/* Add more routes as needed */}
              </Routes>
            </div>
          </main>
        </div>
      </ToastProvider>
    </Router>
  );
};

export default App;
