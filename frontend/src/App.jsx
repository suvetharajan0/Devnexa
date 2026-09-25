import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/layout/ProtectedRoute.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ProjectDetailsPage from './pages/ProjectDetailsPage.jsx';
import TeamWorkspacePage from './pages/TeamWorkspacePage.jsx';
import TeamsPage from './pages/TeamsPage.jsx';
import CreateProjectPage from './pages/CreateProjectPage.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import MessagesPage from './pages/MessagesPage.jsx';
import MyProfilePage from './pages/MyProfilePage.jsx';
import PublicProfilePage from './pages/PublicProfilePage.jsx';
import CodeMentorPage from './pages/CodeMentorPage.jsx';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import EditProjectPage from './pages/EditProjectPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { HomeRoute } from './components/layout/HomeRoute.jsx';
import LandingPage from './pages/LandingPage.jsx'

export default function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
         <SocketProvider>
        <Routes>
        <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/landing' element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell>
                  <DashboardPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ProjectsPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ProjectDetailsPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams/:id"
            element={
              <ProtectedRoute>
                <AppShell>
                  <TeamWorkspacePage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams"
            element={
              <ProtectedRoute>
                <AppShell>
                  <TeamsPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/new"
            element={
              <ProtectedRoute>
                <AppShell>
                  <CreateProjectPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <AppShell>
                  <MessagesPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:conversationId"
            element={
              <ProtectedRoute>
                <AppShell>
                  <MessagesPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppShell>
                  <MyProfilePage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/developers/:userId"
            element={
              <ProtectedRoute>
                <AppShell>
                  <PublicProfilePage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/code-mentor"
            element={
              <ProtectedRoute>
                <AppShell>
                  <CodeMentorPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-analyzer"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ResumeAnalyzerPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <AppShell>
                  <NotificationsPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id/edit"
            element={
              <ProtectedRoute>
                <AppShell>
                  <EditProjectPage />
                </AppShell>
              </ProtectedRoute>
            }
          />          
         <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppShell>
                  <SettingsPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
        </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}