import { render, screen } from '@testing-library/react';
import UserDashboardDetail from "./UserDashboardDetail"
import { UserProvider } from './UserContext';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

describe("UserDashboardDetail", () => {
    test("it works", () => {
        expect(UserDashboardDetail).toBeDefined();
        render(
            <MemoryRouter initialEntries={['/']}>
            <UserProvider>
            <QueryClientProvider client={queryClient}>
                <UserDashboardDetail type={"Bidding"} listings={[]}/>
            </QueryClientProvider>
            </UserProvider>
            </MemoryRouter>
        );
        expect(screen.getByText("Bidding")).toBeInTheDocument();
        expect(screen).toMatchSnapshot();    
    })
});
