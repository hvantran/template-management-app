import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, useTheme, ErrorPageTemplate } from '@hvantran/ui-component-library';
import TemplateCreation from './components/templates/TemplateCreation';
import TemplateDetails from './components/templates/TemplateDetail';
import TemplateSummary from './components/templates/TemplateSummary';
import TemplateTaskCreation from './components/templates/TemplateTaskCreation';
import TemplateTaskDetails from './components/templates/TemplateTaskDetail';
import TemplateTaskSummary from './components/templates/TemplateTaskSummary';
import PrimarySearchAppBar from './ResponsiveAppBar';

function AppContent() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-surface-ground-light dark:bg-surface-ground-dark text-secondary-900 dark:text-secondary-100 font-sans">
      <PrimarySearchAppBar
        toggleDarkMode={resolvedTheme === 'dark'}
        setToggleDarkMode={toggleTheme}
      />
      <main className="w-full">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/templates" />}
            errorElement={<ErrorPageTemplate />}
          />
          <Route path="/templates" element={<TemplateSummary />} />
          <Route path="/templates/new" element={<TemplateCreation />} />
          <Route path="/templates/:templateName" element={<TemplateDetails />} />
          <Route path="/tasks" element={<TemplateTaskSummary />} />
          <Route path="/tasks/new" element={<TemplateTaskCreation />} />
          <Route path="/tasks/:taskId" element={<TemplateTaskDetails />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="template-manager-enable-dark-theme">
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
