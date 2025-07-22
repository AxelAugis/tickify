
let mockUser: { id: number; name: string } | null = { id: 1, name: 'Test User' };
let mockLoading = false;

jest.mock('@/store/useUserStore', () => ({
  __esModule: true,
  default: () => ({
    user: mockUser,
    loading: mockLoading,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('@/utils/database/dashboard/dashboard', () => ({
  getProjects: jest.fn(),
}));

import { getProjects } from '@/utils/database/dashboard/dashboard';
import DashboardHomepage from '@/app/dashboard/page';
import React from 'react';
import { render, screen } from '@testing-library/react';

describe('DashboardHomepage', () => {
  beforeEach(() => {
    (getProjects as jest.Mock).mockReset();
    mockUser = { id: 1, name: 'Test User' };
    mockLoading = false;
  });

  it('renders loading screen when loading is true', () => {
    mockUser = null;
    mockLoading = true;
    render(<DashboardHomepage />);
    expect(screen.getByTestId('screen-loader')).toBeInTheDocument();
  });

  it('renders homepage when loading is false and user is present', () => {
    (getProjects as jest.Mock).mockResolvedValue({ data: [], status: 200 });
    render(<DashboardHomepage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Ajouter un projet')).toBeInTheDocument();
  });

  it('Does not render projects when there are none', async () => {
    (getProjects as jest.Mock).mockResolvedValue({ data: [], status: 200 });
    render(<DashboardHomepage />);
    expect(screen.queryByText('Vos projets')).not.toBeInTheDocument();
  });

  it('renders projects when they are fetched', async () => {
    (getProjects as jest.Mock).mockResolvedValue({
      data: [{ id: 1, name: 'Test Project', uuid: 'test-uuid' }],
      status: 200,
    });
    render(<DashboardHomepage />);
    expect(await screen.findByTestId('project-card')).toBeInTheDocument();
    expect(await screen.findByText('Vos projets')).toBeInTheDocument();
  });
});