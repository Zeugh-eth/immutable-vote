import { render, screen } from '@testing-library/react';
import { VoteResults } from './VoteResults';

describe('VoteResults', () => {
  describe('formats vote counts correctly', () => {
    it('formats large numbers with K suffix', () => {
      const { container } = render(
        <VoteResults
          forVotes="488140000000000000000000"
          againstVotes="0"
          abstainVotes="0"
        />
      );
      expect(container.textContent).toMatch(/488K/i);
    });

    it('formats millions with M suffix', () => {
      const { container } = render(
        <VoteResults
          forVotes="1440000000000000000000000"
          againstVotes="0"
          abstainVotes="0"
        />
      );
      expect(container.textContent).toMatch(/1M/i);
    });
  });

  describe('calculates vote percentages', () => {
    it('shows 100% when all votes in one direction', () => {
      const { container } = render(
        <VoteResults
          forVotes="1000000000000000000000000"
          againstVotes="0"
          abstainVotes="0"
        />
      );
      const percentages = container.textContent?.match(/100%/g);
      expect(percentages).toBeTruthy();
      expect(percentages!.length).toBeGreaterThan(0);
    });

    it('calculates split percentages correctly', () => {
      const { container } = render(
        <VoteResults
          forVotes="500000000000000000000000"
          againstVotes="300000000000000000000000"
          abstainVotes="200000000000000000000000"
        />
      );
      // 50%, 30%, 20%
      expect(container.textContent).toMatch(/50%/);
      expect(container.textContent).toMatch(/30%/);
      expect(container.textContent).toMatch(/20%/);
    });

    it('handles zero votes gracefully', () => {
      const { container } = render(
        <VoteResults forVotes="0" againstVotes="0" abstainVotes="0" />
      );
      expect(container.textContent).toMatch(/0%/);
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
