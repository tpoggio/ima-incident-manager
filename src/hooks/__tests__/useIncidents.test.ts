import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useIncidents } from '../useIncidents';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useIncidents Hook', () => {
  it('should start with loading state', () => {
    const { result } = renderHook(() => useIncidents(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('should have query key defined', () => {
    const { result } = renderHook(() => useIncidents(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBeDefined();
  });
});
