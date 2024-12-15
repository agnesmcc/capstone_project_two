import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from './UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

test('renders App using MemoryRouter', () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/']}>
      <UserProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
      </UserProvider>
    </MemoryRouter>
  );
  expect(container).toMatchSnapshot();
});
