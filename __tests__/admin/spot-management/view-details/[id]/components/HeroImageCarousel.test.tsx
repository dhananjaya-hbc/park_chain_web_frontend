import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import HeroImageCarousel from '@/app/(protected)/admin/spot-management/view-details/[id]/components/HeroImageCarousel';

// Mock lucide-react icons for stable test rendering
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span>left</span>,
  ChevronRight: () => <span>right</span>,
}));

describe('HeroImageCarousel', () => {
  test('shows fallback when images list is empty', () => {
    // Arrange & Act
    render(<HeroImageCarousel images={[]} title="Spot A" amenities={['CCTV']} />);

    // Assert
    expect(screen.getByText('No Image Available')).toBeInTheDocument();
    expect(screen.getByText('CCTV')).toBeInTheDocument();
  });

  test('changes image when clicking slide dot', () => {
    // Arrange
    render(
      <HeroImageCarousel
        images={['https://img/1.jpg', 'https://img/2.jpg']}
        title="Spot A"
        amenities={[]}
      />
    );

    const first = screen.getByAltText('Spot A image 1') as HTMLImageElement;
    expect(first.src).toContain('https://img/1.jpg');

    // Act
    fireEvent.click(screen.getByLabelText('Go to slide 2'));

    // Assert
    const second = screen.getByAltText('Spot A image 2') as HTMLImageElement;
    expect(second.src).toContain('https://img/2.jpg');
  });

  test('changes image when clicking next and prev buttons', () => {
    // Arrange
    render(
      <HeroImageCarousel
        images={['https://img/1.jpg', 'https://img/2.jpg']}
        title="Spot A"
        amenities={[]}
      />
    );

    // Act
    const nextBtn = screen.getByText('right');
    fireEvent.click(nextBtn);

    // Assert next iteration
    const second = screen.getByAltText('Spot A image 2') as HTMLImageElement;
    expect(second.src).toContain('https://img/2.jpg');

    // Act previous navigation
    const prevBtn = screen.getByText('left');
    fireEvent.click(prevBtn);
    
    // Assert state returns
    const first = screen.getByAltText('Spot A image 1') as HTMLImageElement;
    expect(first.src).toContain('https://img/1.jpg');
  });
});