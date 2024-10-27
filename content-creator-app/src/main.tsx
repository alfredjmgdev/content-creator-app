import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './pages/auth/Login';
import UserPage from './pages/User';
import ContentExplorer from './pages/ContentExplorer';
import SignUp from './pages/auth/Signup';
import ContentCategoriesView from './views/ContentCategoriesView';
import ContentThemesView from './views/ContentThemesView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ContentExplorer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="users/:id" element={<UserPage  />} />
        <Route path="/categories" element={<ContentCategoriesView />} />
        <Route path="/themes" element={<ContentThemesView />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);