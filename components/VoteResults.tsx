import { formatVoteCount, calculatePercentages } from '@/lib/utils';

interface VoteResultsProps {
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
}

export function VoteResults({
  forVotes,
  againstVotes,
  abstainVotes,
}: VoteResultsProps) {
  // Format vote counts
  const forFormatted = formatVoteCount(forVotes);
  const againstFormatted = formatVoteCount(againstVotes);
  const abstainFormatted = formatVoteCount(abstainVotes);

  // Calculate percentages
  const { forPct, againstPct, abstainPct } = calculatePercentages(
    forVotes,
    againstVotes,
    abstainVotes
  );

  return (
    <div>
      {/* Vote counts with percentages */}
      <div className="flex items-center gap-6 text-sm mb-2">
        <div>
          <span className="font-medium text-green-600">For:</span>{' '}
          {forFormatted} ({forPct.toFixed(0)}%)
        </div>
        <div>
          <span className="font-medium text-red-600">Against:</span>{' '}
          {againstFormatted} ({againstPct.toFixed(0)}%)
        </div>
        <div>
          <span className="font-medium text-gray-600">Abstain:</span>{' '}
          {abstainFormatted} ({abstainPct.toFixed(0)}%)
        </div>
      </div>

      {/* Progress bars */}
      <div className="flex w-full h-6 rounded overflow-hidden" data-testid="progress-bars">
        {forPct > 0 && (
          <div
            className="bg-green-600 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${forPct}%` }}
            data-testid="bar-for"
            aria-label={`For: ${forFormatted} (${forPct.toFixed(0)}%)`}
          >
            {forPct >= 10 && `${forPct.toFixed(0)}%`}
          </div>
        )}
        {againstPct > 0 && (
          <div
            className="bg-red-600 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${againstPct}%` }}
            data-testid="bar-against"
            aria-label={`Against: ${againstFormatted} (${againstPct.toFixed(0)}%)`}
          >
            {againstPct >= 10 && `${againstPct.toFixed(0)}%`}
          </div>
        )}
        {abstainPct > 0 && (
          <div
            className="bg-gray-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${abstainPct}%` }}
            data-testid="bar-abstain"
            aria-label={`Abstain: ${abstainFormatted} (${abstainPct.toFixed(0)}%)`}
          >
            {abstainPct >= 10 && `${abstainPct.toFixed(0)}%`}
          </div>
        )}
      </div>
    </div>
  );
}
