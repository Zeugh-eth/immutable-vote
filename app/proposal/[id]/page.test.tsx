import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProposalDetailPage from './page';
import { fetchProposal } from '@/lib/gateful';
import { act } from 'react';

// Mock the fetchProposal function
jest.mock('@/lib/gateful', () => ({
  fetchProposal: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

const mockProposal = {
  id: '123',
  daoId: 'ens',
  title: 'Test Proposal for ENS',
  description: 'This is a test proposal',
  status: 'ACTIVE' as const,
  proposerAccountId: '0x1234567890abcdef1234567890abcdef12345678',
  forVotes: '1000000000000000000000',
  againstVotes: '500000000000000000000',
  abstainVotes: '100000000000000000000',
  quorum: '10000000000000000000000',
  startTimestamp: 1710000000,
  endTimestamp: 1710086400,
  timestamp: 1710000000,
  txHash: '0xabc123',
};

describe('ProposalDetailPage', () => {
  let queryClient: QueryClient;

  const renderWithClient = async (id: string) => {
    const params = Promise.resolve({ id });
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ProposalDetailPage params={params} />
        </QueryClientProvider>
      );
    });
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches proposal data from Gateful API', async () => {
    (fetchProposal as jest.Mock).mockResolvedValue(mockProposal);

    await renderWithClient('123');

    // Wait for the fetch to be called
    await screen.findByText('Test Proposal for ENS');
    expect(fetchProposal).toHaveBeenCalledWith('123');
  });

  it('displays proposal title', async () => {
    (fetchProposal as jest.Mock).mockResolvedValue(mockProposal);

    await renderWithClient('123');

    const title = await screen.findByText('Test Proposal for ENS');
    expect(title).toBeInTheDocument();
  });

  it('displays proposer address', async () => {
    (fetchProposal as jest.Mock).mockResolvedValue(mockProposal);

    await renderWithClient('123');

    // Should show truncated address
    const proposer = await screen.findByText(/0x1234.*5678/);
    expect(proposer).toBeInTheDocument();
  });

  it('displays status badge', async () => {
    (fetchProposal as jest.Mock).mockResolvedValue(mockProposal);

    await renderWithClient('123');

    const status = await screen.findByText('ACTIVE');
    expect(status).toBeInTheDocument();
  });

  it('shows back button linking to proposals list', async () => {
    (fetchProposal as jest.Mock).mockResolvedValue(mockProposal);

    await renderWithClient('123');

    const backButton = await screen.findByText(/Back to Proposals/);
    expect(backButton).toBeInTheDocument();
    
    const link = backButton.closest('a');
    expect(link).toHaveAttribute('href', '/');
  });

  it('shows loading skeleton while fetching', async () => {
    (fetchProposal as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockProposal), 100))
    );

    await renderWithClient('123');

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Loading proposal...')).toBeInTheDocument();
    });
    
    // Wait for proposal to load
    await screen.findByText('Test Proposal for ENS');
  });

  it('shows error state when fetch fails or 404', async () => {
    (fetchProposal as jest.Mock).mockRejectedValue(new Error('Not found'));

    await renderWithClient('999');

    const error = await screen.findByText(/Proposal not found|Failed to load/);
    expect(error).toBeInTheDocument();
  });
});
