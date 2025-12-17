import { render } from '@testing-library/react';
import { Spinner, LoadingScreen } from '../Spinner';

describe('Spinner Component', () => {
  it('should render spinner', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass('animate-spin');
  });

  it('should apply size classes', () => {
    const { container, rerender } = render(<Spinner size="sm" />);
    expect(container.firstChild).toHaveClass('h-4', 'w-4');

    rerender(<Spinner size="md" />);
    expect(container.firstChild).toHaveClass('h-8', 'w-8');

    rerender(<Spinner size="lg" />);
    expect(container.firstChild).toHaveClass('h-12', 'w-12');
  });

  it('should apply custom className', () => {
    const { container } = render(<Spinner className="custom-spinner" />);
    expect(container.firstChild).toHaveClass('custom-spinner');
  });

  it('should have default size md', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass('h-8', 'w-8');
  });
});

describe('LoadingScreen Component', () => {
  it('should render loading screen with spinner', () => {
    const { container } = render(<LoadingScreen />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should center the spinner', () => {
    const { container } = render(<LoadingScreen />);
    expect(container.firstChild).toHaveClass('flex', 'items-center', 'justify-center');
  });
});
