import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { SiteLayout } from './components/SiteLayout'
import { SiteSettingsProvider } from './site/SiteSettingsProvider'
import { AboutPage } from './pages/AboutPage'
import { BlogIndexPage } from './pages/BlogIndexPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { HomePage } from './pages/HomePage'
import { NewPostPage } from './pages/NewPostPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteSettingsProvider>
          <SiteLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogIndexPage />} />
              <Route path="/blog/new" element={<NewPostPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SiteLayout>
        </SiteSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
