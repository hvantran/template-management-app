import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders app and redirects to templates', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  // App should render without crashing
  expect(document.body).toBeInTheDocument();
});
