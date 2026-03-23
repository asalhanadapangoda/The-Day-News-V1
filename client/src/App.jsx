import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Chatbot from './components/common/Chatbot';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import ExternalRedirect from './components/common/ExternalRedirect';

// User Pages
import HomePage from './pages/HomePage';
import PodcastsPage from './pages/PodcastsPage';
import FullEpisodePage from './pages/FullEpisodePage';
import ArticlesPage from './pages/ArticlesPage';
import SingleArticlePage from './pages/SingleArticlePage';
import UpcomingPage from './pages/UpcomingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddPodcast from './pages/admin/AddPodcast';
import EditPodcast from './pages/admin/EditPodcast';
import UpdatePodcast from './pages/admin/UpdatePodcast';
import ManageSections from './pages/admin/ManageSections';
import ManageUpcoming from './pages/admin/ManageUpcoming';
import ManageArticleSections from './pages/admin/ManageArticleSections';
import AddArticle from './pages/admin/AddArticle';
import EditArticle from './pages/admin/EditArticle';
import UpdateArticle from './pages/admin/UpdateArticle';

// Layout wrapper for user pages
const UserLayout = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public User Routes - No authentication required */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/podcasts" element={<PodcastsPage />} />
          <Route path="/podcasts/:id/video" element={<FullEpisodePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<SingleArticlePage />} />
          <Route path="/upcoming" element={<UpcomingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* TV Route - Redirect to Google Sites */}
        <Route
          path="/tv"
          element={
            <ExternalRedirect to="https://sites.google.com/view/thedaynewsglobal/home" />
          }
        />

        {/* Admin Login - Only accessible when NOT authenticated */}
        <Route
          path="/admin"
          element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          }
        />
        
        {/* All Admin Dashboard Routes - ALL protected */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard/edit-podcast" replace />} />
          <Route path="sections" element={<ManageSections />} />
          <Route path="add-podcast" element={<AddPodcast />} />
          <Route path="edit-podcast" element={<EditPodcast />} />
          <Route path="edit-podcast/:id" element={<UpdatePodcast />} />
          <Route path="article-sections" element={<ManageArticleSections />} />
          <Route path="add-article" element={<AddArticle />} />
          <Route path="edit-article" element={<EditArticle />} />
          <Route path="edit-article/:id" element={<UpdateArticle />} />
          <Route path="upcoming" element={<ManageUpcoming />} />
        </Route>
        
        {/* Catch-all for any other admin routes - redirect to login */}
        <Route 
          path="/admin/*" 
          element={<Navigate to="/admin" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
