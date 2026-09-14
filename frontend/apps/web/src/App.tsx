import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { SiteLayout } from './components/SiteLayout'
import { SiteSettingsProvider } from './site/SiteSettingsProvider'
import { AboutPage } from './pages/AboutPage'
import { BlogIndexPage } from './pages/BlogIndexPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { HomePage } from './pages/HomePage'
import { NewPostPage } from './pages/NewPostPage'
import { PROJECTS, WRITING } from './site/sections'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteSettingsProvider>
          <SiteLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path={WRITING.path} element={<BlogIndexPage section={WRITING} />} />
              <Route path={`${WRITING.path}/new`} element={<NewPostPage section={WRITING} />} />
              <Route path={`${WRITING.path}/:slug`} element={<BlogPostPage section={WRITING} />} />
              <Route path={PROJECTS.path} element={<BlogIndexPage section={PROJECTS} />} />
              <Route path={`${PROJECTS.path}/new`} element={<NewPostPage section={PROJECTS} />} />
              <Route path={`${PROJECTS.path}/:slug`} element={<BlogPostPage section={PROJECTS} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SiteLayout>
        </SiteSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
