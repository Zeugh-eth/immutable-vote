import Link from 'next/link';
import { StatusBadge } from './StatusBadge';
import { VoteResults } from './VoteResults';

interface Proposal {
  id: string;
  title: string;
  status: string;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  timestamp: number;
}

interface ProposalCardProps {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  return (
    <Link
      href={`/proposal/${proposal.id}`}
      className="block bg-white rounded-lg shadow border border-gray-200 p-6 cursor-pointer hover:bg-gray-50 transition-colors"
      aria-label={`View proposal: ${proposal.title}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">
          {proposal.title}
        </h3>
        <div className="ml-4">
          <StatusBadge status={proposal.status} />
        </div>
      </div>

      <div className="mt-4">
        <VoteResults
          forVotes={proposal.forVotes}
          againstVotes={proposal.againstVotes}
          abstainVotes={proposal.abstainVotes}
        />
      </div>

      <div className="text-xs text-gray-500 mt-2">
        <time dateTime={new Date(proposal.timestamp * 1000).toISOString()}>
          Proposed {new Date(proposal.timestamp * 1000).toLocaleDateString()}
        </time>
      </div>
    </Link>
  );
}
