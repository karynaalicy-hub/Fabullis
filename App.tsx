
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import StoryDetailPage from './pages/StoryDetailPage';
import ReaderPage from './pages/ReaderPage';
import StorePage from './pages/StorePage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';
import WriterDashboardPage from './pages/WriterDashboardPage';
import ReaderDashboardPage from './pages/ReaderDashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthorProfilePage from './pages/AuthorProfilePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="historias" element={<LibraryPage />} />
          <Route path="historias/:storyId" element={<StoryDetailPage />} />
          <Route path="historias/:storyId/:chapterNumber" element={<ReaderPage />} />
          <Route path="loja" element={<StorePage />} />
          <Route path="carrinho" element={<CartPage />} />
          <Route path="login" element={<AuthPage />} />
          <Route path="autores/:authorId" element={<AuthorProfilePage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="painel-escritor" element={<WriterDashboardPage />} />
            <Route path="painel-leitor" element={<ReaderDashboardPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;