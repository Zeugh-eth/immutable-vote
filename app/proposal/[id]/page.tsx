'use client';

import { use } from 'react';
import Link from 'next/link';
import { useProposal } from '@/lib/hooks/useProposal';
import { ProposalHeader } from '@/components/ProposalHeader';

interface ProposalDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProposalDetailPage({ params }: ProposalDetailPageProps) {
  const { id } = use(params);
  const { data: proposal, isLoading, error } = useProposal(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading proposal...</div>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-red-600">
            {error ? 'Failed to load' : 'Proposal not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
          ← Back to Proposals
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ProposalHeader
            title={proposal.title}
            status={proposal.status}
            proposerAddress={proposal.proposerAccountId}
          />
        </div>
      </div>
    </div>
  );
}
