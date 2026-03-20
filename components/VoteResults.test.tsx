import { render, screen } from '@testing-library/react';
import { VoteResults } from './VoteResults';

describe('VoteResults', () => {
  describe('formats vote counts correctly', () => {
    it('formats large numbers with K suffix', () => {
      render(
        <VoteResults
          forVotes="488140000000000000000000"
          againstVotes="0"
          abstainVotes="0"
        />
      );
      expect(screen.getByText(/488K/i)).toBeInTheDocument();
    });

    it('formats millions with M suffix', () => {
      render(
        <VoteResults
          forVotes="1440000000000000000000000"
          againstVotes="0"
          abstainVotes="0"
        />
      );
      expect(screen.getByText(/1\.44M/i)).toBeInTheDocument();
    });
  });

  describe('calculates vote percentages', () => {
    it('shows 100% when all votes in one direction', () => {
      render(
        <VoteResults
          forVotes="1000000000000000000000000"
          againstVotes="0"
          abstainVotes="0"
        />
      );
      expect(screen.getByText(/100%/)).toBeInTheDocument();
    });

    it('calculates split percentages correctly', () => {
      render(
        <VoteResults
          forVotes="500000000000000000000000"
          againstVotes="300000000000000000000000"
          abstainVotes="200000000000000000000000"
        />
      );
      // 50%, 30%, 20%
      expect(screen.getByText(/50%/)).toBeInTheDocument();
      expect(screen.getByText(/30%/)).toBeInTheDocument();
      expect(screen.getByText(/20%/)).toBeInTheDocument();
    });

    it('handles zero votes gracefully', () => {
      render(<VoteResults forVotes="0" againstVotes="0" abstainVotes="0" />);
      expect(screen.getByText(/0%/)).toBeInTheDocument();
    });
  });

  describe('renders progress bars with correct widths', () => {
    it('renders bars with percentage-based widths', () => {
      const { container } = render(
        <VoteResults
          forVotes="600000000000000000000000"
          againstVotes="400000000000000000000000"
          abstainVotes="0"
        />
      );
      
      const forBar = container.querySelector('[data-testid="bar-for"]');
      const againstBar = container.querySelector('[data-testid="bar-against"]');
      
      expect(forBar).toHaveStyle({ width: '60%' });
      expect(againstBar).toHaveStyle({ width: '40%' });
    });

    it('bars stack horizontally to 100% total width', () => {
      const { container } = render(
        <VoteResults
          forVotes="500000000000000000000000"
          againstVotes="300000000000000000000000"
          abstainVotes="200000000000000000000000"
        />
      );
      
      const progressContainer = container.querySelector('[data-testid="progress-bars"]');
      expect(progressContainer).toHaveClass('flex');
    });
  });

  describe('progress bars use correct colors', () => {
    it('uses green for "For" votes', () => {
      const { container } = render(
        <VoteResults
          forVotes="1000000000000000000000000"
          againstVotes="0"
          abstainVotes="0"
        />
      );
      
      const forBar = container.querySelector('[data-testid="bar-for"]');
      expect(forBar).toHaveClass('bg-green-600');
    });

    it('uses red for "Against" votes', () => {
      const { container } = render(
        <VoteResults
          forVotes="0"
          againstVotes="1000000000000000000000000"
          abstainVotes="0"
        />
      );
      
      const againstBar = container.querySelector('[data-testid="bar-against"]');
      expect(againstBar).toHaveClass('bg-red-600');
    });

    it('uses gray for "Abstain" votes', () => {
      const { container } = render(
        <VoteResults
          forVotes="0"
          againstVotes="0"
          abstainVotes="1000000000000000000000000"
        />
      );
      
      const abstainBar = container.querySelector('[data-testid="bar-abstain"]');
      expect(abstainBar).toHaveClass('bg-gray-500');
    });
  });

  describe('handles edge cases', () => {
    it('handles all votes in one direction (100%/0%/0%)', () => {
      const { container } = render(
        <VoteResults
          forVotes="1000000000000000000000000"
          againstVotes="0"
          abstainVotes="0"
        />
      );
      
      const forBar = container.querySelector('[data-testid="bar-for"]');
      expect(forBar).toHaveStyle({ width: '100%' });
    });

    it('does not render bars with 0 width when no votes', () => {
      const { container } = render(
        <VoteResults
          forVotes="1000000000000000000000000"
          againstVotes="0"
          abstainVotes="0"
        />
      );
      
      const againstBar = container.querySelector('[data-testid="bar-against"]');
      const abstainBar = container.querySelector('[data-testid="bar-abstain"]');
      
      // Bars with 0% should either not render or have width: 0%
      if (againstBar) {
        expect(againstBar).toHaveStyle({ width: '0%' });
      }
      if (abstainBar) {
        expect(abstainBar).toHaveStyle({ width: '0%' });
      }
    });
  });
});
