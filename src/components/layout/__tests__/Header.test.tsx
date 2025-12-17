import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../Header';

vi.mock('@/store', () => ({
  useAuthStore: () => ({
    user: { id: '1', username: 'admin', role: 'admin' },
    logout: vi.fn(),
  }),
}));

describe('Header Component', () => {
  it('should render header with logo', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText('IMA')).toBeInTheDocument();
  });

  it('should render user name', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('should render language selector', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const selects = document.querySelectorAll('select');
    expect(selects.length).toBeGreaterThan(0);
  });
});
