'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProposals } from '@/lib/gateful';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function ProposalsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => fetchProposals({ limit: 20 }),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ENS Governance</h1>
          <ConnectButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Proposals</h2>
          <p className="text-sm text-gray-600 mt-1">
            {data?.totalCount || 0} total proposals
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading proposals...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Failed to load proposals</p>
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {data.items.map((proposal) => (
              <Link
                key={proposal.id}
                href={`/proposal/${proposal.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {proposal.title}
                  </h3>
                  <span
                    className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                      proposal.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : proposal.status === 'EXECUTED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {proposal.status}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600 mt-4">
                  <div>
                    <span className="font-medium text-green-600">For:</span>{' '}
                    {(Number(proposal.forVotes) / 1e18).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <div>
                    <span className="font-medium text-red-600">Against:</span>{' '}
                    {(Number(proposal.againstVotes) / 1e18).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Abstain:</span>{' '}
                    {(Number(proposal.abstainVotes) / 1e18).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  Proposed {new Date(proposal.timestamp * 1000).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
