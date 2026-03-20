/**
 * Truncates an Ethereum address to show first 6 and last 4 characters
 * @param address - Full Ethereum address
 * @returns Truncated address in format 0x1234...5678
 */
export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
