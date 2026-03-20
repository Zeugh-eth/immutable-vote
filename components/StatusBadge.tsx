interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass =
    status === 'ACTIVE'
      ? 'bg-green-100 text-green-800'
      : status === 'EXECUTED'
      ? 'bg-blue-100 text-blue-800'
      : status === 'DEFEATED'
      ? 'bg-red-100 text-red-800'
      : status === 'QUEUED'
      ? 'bg-yellow-100 text-yellow-800'
      : status === 'PENDING_EXECUTION'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
}
