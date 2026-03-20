/**
 * Truncates an Ethereum address to show first 6 and last 4 characters
 * @param address - Full Ethereum address
 * @returns Truncated address in format 0x1234...5678
 */
export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formats a vote count from wei-like string to human-readable compact notation
 * @param voteString - Vote count in wei-like format (e.g., "488140000000000000000000")
 * @returns Formatted vote count (e.g., "488K", "1M")
 */
export function formatVoteCount(voteString: string): string {
  const votes = Number(voteString) / 1e18;
  const formatter = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 0,
  });
  return formatter.format(votes);
}

/**
 * Calculates vote percentages from vote counts
 * @param forVotes - For votes in wei-like format
 * @param againstVotes - Against votes in wei-like format
 * @param abstainVotes - Abstain votes in wei-like format
 * @returns Object with percentages for each vote type
 */
export function calculatePercentages(
  forVotes: string,
  againstVotes: string,
  abstainVotes: string
): { forPct: number; againstPct: number; abstainPct: number } {
  const forCount = Number(forVotes) / 1e18;
  const againstCount = Number(againstVotes) / 1e18;
  const abstainCount = Number(abstainVotes) / 1e18;
  
  const total = forCount + againstCount + abstainCount;
  
  return {
    forPct: total > 0 ? (forCount / total) * 100 : 0,
    againstPct: total > 0 ? (againstCount / total) * 100 : 0,
    abstainPct: total > 0 ? (abstainCount / total) * 100 : 0,
  };
}
