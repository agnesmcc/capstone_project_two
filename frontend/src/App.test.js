import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { UserProvider } from './UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const { container } = render(
  <MemoryRouter initialEntries={['/']}>
    <UserProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    </UserProvider>
  </MemoryRouter>
);

test('renders App using MemoryRouter', () => {  
  expect(container).toMatchSnapshot();
});

// test('clicking on Signup navigates to the signup page', () => {
//   const signupLink = screen.getByText('Signup');
//   signupLink.click();
//   expect(window.location.pathname).toBe('/signup');
// });
