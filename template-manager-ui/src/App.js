import { Stack, ThemeProvider, CssBaseline } from '@mui/material'
import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ErrorPage from './components/common/ErrorPage'
import TemplateCreation from './components/templates/TemplateCreation'
import TemplateDetails from './components/templates/TemplateDetail'
import TemplateSummary from './components/templates/TemplateSummary'
import TemplateTaskCreation from './components/templates/TemplateTaskCreation'
import TemplateTaskDetails from './components/templates/TemplateTaskDetail'
import TemplateTaskSummary from './components/templates/TemplateTaskSummary'
import { DARK_THEME, DEFAULT_THEME, LocalStorageService } from './components/GenericConstants'
import PrimarySearchAppBar from './ResponsiveAppBar'

const selectThemeStorageKey = "template-manager-enable-dark-theme"

function App() {
  const [toggleDarkMode, setToggleDarkMode] = React.useState(LocalStorageService.getOrDefault(selectThemeStorageKey, false) === 'true');
  const switchTheme = () => {
    setToggleDarkMode((previous) => {
      LocalStorageService.put(selectThemeStorageKey, !previous);
      return !previous
    })
  }
  return (
    <ThemeProvider theme={!toggleDarkMode ? DEFAULT_THEME : DARK_THEME}>
      <CssBaseline />
      <Stack>
        <PrimarySearchAppBar toggleDarkMode={toggleDarkMode} setToggleDarkMode={switchTheme} />
        <Routes>
          <Route
            path='/'
            element={<Navigate to="/templates" />}
            errorElement={<ErrorPage />}
          >
          </Route>
          <Route path='/templates' element={<TemplateSummary />}></Route>
          <Route path='/templates/new' element={<TemplateCreation />}></Route>
          <Route
            path='/templates/:templateName'
            element={<TemplateDetails />}
          ></Route>
          <Route path='/tasks' element={<TemplateTaskSummary />}></Route>
          <Route path='/tasks/new' element={<TemplateTaskCreation />}></Route>
          <Route
            path='/tasks/:taskId'
            element={<TemplateTaskDetails />}
          ></Route>
        </Routes>
      </Stack>
      <ToastContainer />
    </ThemeProvider>
  )
}
export default App
