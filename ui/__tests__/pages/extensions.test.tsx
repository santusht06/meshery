import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Keys } from '@meshery/schemas/permissions';

const { useHasPermission } = vi.hoisted(() => ({ useHasPermission: vi.fn() }));

vi.mock('@sistent/sistent', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@sistent/sistent')>();
  return {
    ...actual,
    useHasPermission,
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    CatalogIcon: () => <span data-testid="catalog-icon" />,
    Grid2: ({ children }: any) => <div>{children}</div>,
    Switch: () => <input type="checkbox" data-testid="switch" />,
    Typography: ({ children }: any) => <span>{children}</span>,
    useTheme: () => ({ palette: { mode: 'light', text: { brand: '#000' } } }),
    Box: ({ children }: any) => <div>{children}</div>,
    styled: (comp: any) => () => comp,
  };
});

vi.mock('@/components/general/MesheryPage', () => ({
  MesheryPage: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid="meshery-page" data-title={title}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/general/error-404', () => ({
  default: ({ permissionKey }: { permissionKey: { id: string } }) => (
    <div data-testid="default-error">{permissionKey?.id}</div>
  ),
}));

vi.mock('@/rtk-query/user', () => ({
  useGetUserPrefQuery: () => ({ data: { usersExtensionPreferences: { catalogContent: true } } }),
  useUpdateUserPrefMutation: () => [vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() })],
  useGetProviderCapabilitiesQuery: () => ({ data: { extensions: {} } }),
  useGetSystemVersionQuery: () => ({ data: { build: 'v1.0.0' } }),
  useInstallProviderExtensionMutation: () => [vi.fn()],
  useRemoveProviderExtensionMutation: () => [vi.fn()],
}));

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
}));

vi.mock('@/utils/hooks', () => ({
  useNotification: () => ({ notify: vi.fn() }),
  usePageTitle: vi.fn(),
}));

vi.mock('../../components/extensions', () => ({
  Adapters: () => <div data-testid="mock-adapters" />,
  VisualDesignerExtension: () => <div data-testid="mock-visual-designer" />,
}));

import ExtensionsPage from '../../pages/extensions';

describe('ExtensionsPage access gate and shell wrapping', () => {
  beforeEach(() => {
    useHasPermission.mockReset();
  });

  it('renders inside MesheryPage with title "Extensions"', () => {
    useHasPermission.mockReturnValue(true);

    render(<ExtensionsPage />);

    const pageShell = screen.getByTestId('meshery-page');
    expect(pageShell).toBeInTheDocument();
    expect(pageShell).toHaveAttribute('data-title', 'Extensions');
  });

  it('renders DefaultError within MesheryPage when access is denied', () => {
    useHasPermission.mockReturnValue(false);

    render(<ExtensionsPage />);

    expect(screen.getByTestId('meshery-page')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-visual-designer')).not.toBeInTheDocument();
    expect(screen.getByTestId('default-error')).toHaveTextContent(
      Keys.ExtensibilityViewExtensions.id,
    );
  });

  it('renders extension cards when access is permitted', () => {
    useHasPermission.mockReturnValue(true);

    render(<ExtensionsPage />);

    expect(screen.getByTestId('mock-visual-designer')).toBeInTheDocument();
    expect(screen.getByTestId('mock-adapters')).toBeInTheDocument();
    expect(screen.queryByTestId('default-error')).not.toBeInTheDocument();
  });

  it('gates on ExtensibilityViewExtensions permission key', () => {
    useHasPermission.mockReturnValue(true);

    render(<ExtensionsPage />);

    expect(useHasPermission).toHaveBeenCalledWith(Keys.ExtensibilityViewExtensions);
  });
});
