import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '../Select';

describe('Select Component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ];

  it('should render select element', () => {
    const { container } = render(<Select options={options} />);
    expect(container.querySelector('select')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Select label="Test Label" options={options} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should render options', () => {
    const { container } = render(<Select options={options} />);
    const optionElements = container.querySelectorAll('option');
    expect(optionElements.length).toBeGreaterThan(0);
  });

  it('should handle onChange', () => {
    const handleChange = vi.fn();
    const { container } = render(<Select options={options} onChange={handleChange} />);
    const select = container.querySelector('select');
    if (select) {
      fireEvent.change(select, { target: { value: 'option1' } });
      expect(handleChange).toHaveBeenCalled();
    }
  });

  it('should display error message', () => {
    render(<Select options={options} error="Error message" />);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
