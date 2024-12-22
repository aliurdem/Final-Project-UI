import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import OurRoutes from './pages/OurRoutes';
import AdminPanel from './pages/AdminPanel';
import Favorites from './pages/Favorites';
import NewRoutes from './pages/NewRoutes';
import NewPlaces from './pages/NewPlaces';
import AccessDenied from './pages/Denied';
import ProtectedRoute from './components/HomePage/ProtectedRoute';

import Places from './pages/Places';
import { UserProvider } from './components/HomePage/UserContext';
import AppBar from './components/HomePage/AppBar';
import { GoogleMapsProvider } from './components/HomePage/GoogleMapProvider';
import MyRoutes from './pages/MyRoutes';

const { Content } = Layout;

// Yeni bir bileşen oluşturuyoruz
const LayoutWithAppBar = () => {
  const location = useLocation();

  // AppBar'ın gösterilmeyeceği sayfaların yolları
  const hiddenPaths = ['/login', '/signup'];

  // Eğer mevcut yol bu listede varsa AppBar render edilmez
  const hideAppBar = hiddenPaths.includes(location.pathname);

  return (
    <Layout>
      {!hideAppBar && <AppBar />} {/* Koşullu AppBar */}
      <Content>
        <Routes>
         <Route
            path="/admin-panel"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/our-routes" element={<OurRoutes />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/new-routes" element={<NewRoutes />} />
          <Route path="/my-routes" element={<MyRoutes />} />
          <Route path="/places" element={<Places />} />
          <Route path='/new-places' element={<NewPlaces />}></Route>
          <Route path="/denied" element={<AccessDenied />} />
        </Routes>
      </Content>
    </Layout>
  );
};

function App() {
  return (
    <UserProvider>
        <GoogleMapsProvider>
      <Router>
        <LayoutWithAppBar />
      </Router>
      </GoogleMapsProvider>

    </UserProvider>
  );
}
export default App;
