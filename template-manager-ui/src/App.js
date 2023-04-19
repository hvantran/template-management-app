import { Stack, ThemeProvider } from '@mui/material';
import React from 'react';
import { Route, Routes } from "react-router-dom";
import PrimarySearchAppBar from './ResponsiveAppBar';
import HomeContent from './components/HomeContent';
import TemplateSummary from './components/templates/TemplateSummary';
import TemplateDetails from './components/templates/TemplateDetail';
import TemplateCreation from './components/templates/TemplateCreation';
import ErrorPage from './components/common/ErrorPage';
import { DEFAULT_THEME } from './components/GenericConstants';
import TemplateTaskSummary from './components/templates/TemplateTaskSummary';
import TemplateTaskCreation from './components/templates/TemplateTaskCreation';
import TemplateTaskDetails from './components/templates/TemplateTaskDetail';


function App() {
  return (
    <ThemeProvider theme={DEFAULT_THEME}>
      <Stack spacing={4}>
        <PrimarySearchAppBar />
        <Routes>
          <Route path='/' element={<HomeContent />} errorElement={<ErrorPage />}></Route>
          <Route path='/templates' element={<TemplateSummary />}></Route>
          <Route path='/templates/new' element={<TemplateCreation />}></Route>
          <Route path='/templates/:templateName' element={<TemplateDetails />}></Route>
          <Route path='/tasks' element={<TemplateTaskSummary />}></Route>
          <Route path='/tasks/new' element={<TemplateTaskCreation />}></Route>
          <Route path='/tasks/:taskId' element={<TemplateTaskDetails />}></Route>
        </Routes>
      </Stack>
    </ThemeProvider>
  );
}
export default App;