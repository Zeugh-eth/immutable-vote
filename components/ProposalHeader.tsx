import { StatusBadge } from './StatusBadge';
import { truncateAddress } from '@/lib/utils';

interface ProposalHeaderProps {
  title: string;
  status: string;
  proposerAddress: string;
}

export function ProposalHeader({ title, status, proposerAddress }: ProposalHeaderProps) {
  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <StatusBadge status={status} />
      </div>

      <div className="text-sm text-gray-600">
        Proposer: {truncateAddress(proposerAddress)}
      </div>
    </div>
  );
}
