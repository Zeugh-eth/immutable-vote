import { useQuery } from '@tanstack/react-query';
import { fetchProposal } from '@/lib/gateful';

export function useProposal(id: string) {
  return useQuery({
    queryKey: ['proposal', id],
    queryFn: () => fetchProposal(id),
  });
}
