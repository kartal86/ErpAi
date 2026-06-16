import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import AiReportingPage from './pages/AiReportingPage';

console.log("APP YÜKLENDİ");

function App() {
  console.log("APP RENDER EDİLİYOR");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="ai-reporting" element={<AiReportingPage />} />
          <Route path="customers" element={<div className="p-8">Müşteriler (Yapım Aşamasında)</div>} />
          <Route path="orders" element={<div className="p-8">Siparişler (Yapım Aşamasında)</div>} />
          <Route path="products" element={<div className="p-8">Ürünler (Yapım Aşamasında) Test deneme</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;