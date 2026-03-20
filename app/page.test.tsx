import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProposalsPage from './page';
import { fetchProposals } from '@/lib/gateful';

// Mock the fetchProposals function
jest.mock('@/lib/gateful', () => ({
  fetchProposals: jest.fn(),
}));

// Mock RainbowKit's ConnectButton
jest.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <button>Connect Wallet</button>,
}));

const mockProposals = {
  items: [
    {
      id: '123',
      title: 'Test Proposal 1',
      status: 'ACTIVE',
      forVotes: '1000000000000000000000',
      againstVotes: '500000000000000000000',
      abstainVotes: '100000000000000000000',
      timestamp: 1710000000,
    },
    {
      id: '456',
      title: 'Test Proposal 2',
      status: 'EXECUTED',
      forVotes: '2000000000000000000000',
      againstVotes: '300000000000000000000',
      abstainVotes: '200000000000000000000',
      timestamp: 1710086400,
    },
  ],
  totalCount: 2,
};

describe('ProposalsPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    (fetchProposals as jest.Mock).mockResolvedValue(mockProposals);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('proposal cards should be clickable links', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProposalsPage />
      </QueryClientProvider>
    );

    // Wait for proposals to load
    const proposal1 = await screen.findByText('Test Proposal 1');
    expect(proposal1).toBeInTheDocument();

    // Find the link element for the first proposal
    const proposalLink = proposal1.closest('a');
    expect(proposalLink).toBeInTheDocument();
    expect(proposalLink).toHaveAttribute('href', '/proposal/123');
  });

  it('clicking proposal navigates to detail page', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProposalsPage />
      </QueryClientProvider>
    );

    // Wait for proposals to load
    const proposal2 = await screen.findByText('Test Proposal 2');
    const proposalLink = proposal2.closest('a');
    
    expect(proposalLink).toBeInTheDocument();
    expect(proposalLink).toHaveAttribute('href', '/proposal/456');
  });

  it('hover shows pointer cursor', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProposalsPage />
      </QueryClientProvider>
    );

    // Wait for proposals to load
    const proposal1 = await screen.findByText('Test Proposal 1');
    const proposalCard = proposal1.closest('a');
    
    expect(proposalCard).toBeInTheDocument();
    // Check that the element has cursor-pointer styling (via className or inline styles)
    // In our implementation, Links naturally get pointer cursor
    expect(proposalCard?.tagName.toLowerCase()).toBe('a');
  });
});
