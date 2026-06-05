import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminSpotManagementPage from '@/app/(protected)/admin/spot-management/page';

jest.mock('@/app/(protected)/admin/spot-management/components/Main', () => ({
  __esModule: true,
  default: () => <div data-testid="main-component">Main Component</div>,
}));

describe('AdminSpotManagementPage', () => {
  test('renders wrapper and Main component', () => {
    // Arrange & Act
    const { container } = render(<AdminSpotManagementPage />);

    // Assert correct components mount successfully
    expect(screen.getByTestId('main-component')).toBeInTheDocument();
    expect(container.querySelector('.p-6')).toBeTruthy();
  });
});