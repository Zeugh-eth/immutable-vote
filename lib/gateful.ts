// Gateful REST API client for ENS DAO

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://gateful.up.railway.app';

export interface Proposal {
  id: string;
  daoId: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'EXECUTED' | 'PENDING_EXECUTION' | 'DEFEATED' | 'CANCELLED' | 'QUEUED';
  proposerAccountId: string;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  quorum: string;
  startTimestamp: number;
  endTimestamp: number;
  timestamp: number;
  txHash: string;
  calldatas?: string[];
  targets?: string[];
  values?: string[];
}

export interface Vote {
  voterAddress: string;
  proposalId: string;
  support: 0 | 1 | 2; // 0 = against, 1 = for, 2 = abstain
  votingPower: string;
  reason: string;
  timestamp: number;
  transactionHash: string;
  proposalTitle?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
}

export async function fetchProposals(
  params?: {
    limit?: number;
    skip?: number;
    status?: Proposal['status'];
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }
): Promise<PaginatedResponse<Proposal>> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.skip) query.set('skip', params.skip.toString());
  if (params?.status) query.set('status', params.status);
  if (params?.orderBy) query.set('orderBy', params.orderBy);
  if (params?.orderDirection) query.set('orderDirection', params.orderDirection);

  const url = `${API_BASE}/ens/proposals${query.toString() ? `?${query}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch proposals: ${res.statusText}`);
  return res.json();
}

export async function fetchProposal(id: string): Promise<Proposal> {
  const res = await fetch(`${API_BASE}/ens/proposals/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch proposal: ${res.statusText}`);
  return res.json();
}

export async function fetchProposalVotes(
  proposalId: string,
  params?: {
    limit?: number;
    skip?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }
): Promise<PaginatedResponse<Vote>> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.skip) query.set('skip', params.skip.toString());
  if (params?.orderBy) query.set('orderBy', params.orderBy);
  if (params?.orderDirection) query.set('orderDirection', params.orderDirection);

  const url = `${API_BASE}/ens/proposals/${proposalId}/votes${query.toString() ? `?${query}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch votes: ${res.statusText}`);
  return res.json();
}
