import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SpotImagesCard from '@/app/(protected)/seller/addnew/Components/SpotImagesCard';

// Mock URL.createObjectURL since it's not available in jsdom
beforeAll(() => {
    window.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock-url');
});

afterAll(() => {
    (window.URL.createObjectURL as jest.Mock).mockReset();
});

describe('SpotImagesCard Component', () => {
    const mockSetImageFiles = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ════════════════════════════════════════════════════
    // GROUP 1: RENDERING
    // ════════════════════════════════════════════════════
    describe('Rendering', () => {
        test('renders component properly', () => {
            render(<SpotImagesCard imageFiles={[]} setImageFiles={mockSetImageFiles} />);

            expect(screen.getByText('Spot Images')).toBeTruthy();
            expect(screen.getByText('Click to upload or drag')).toBeTruthy();
            expect(screen.getByText('Browse File')).toBeTruthy();
        });

        test('renders correct number of images (up to 3)', () => {
            const files = [
                new File([''], 'img1.jpg', { type: 'image/jpeg' }),
                new File([''], 'img2.jpg', { type: 'image/jpeg' }),
                new File([''], 'img3.jpg', { type: 'image/jpeg' }),
            ];

            const { container } = render(<SpotImagesCard imageFiles={files} setImageFiles={mockSetImageFiles} />);
            
            const images = container.querySelectorAll('img');
            expect(images.length).toBe(3);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 2: FILE UPLOAD
    // ════════════════════════════════════════════════════
    describe('File Upload', () => {
        test('handles file selection via input', () => {
            render(<SpotImagesCard imageFiles={[]} setImageFiles={mockSetImageFiles} />);

            // The input is hidden, but we can find it by type or role if queried appropriately, 
            // but let's query it by tag name and type
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            
            const file = new File([''], 'test.png', { type: 'image/png' });
            
            // Simulating file upload
            fireEvent.change(fileInput, { target: { files: [file] } });

            expect(mockSetImageFiles).toHaveBeenCalled();
            const updateCall = mockSetImageFiles.mock.calls[0][0];
            expect(updateCall.length).toBe(1);
            expect(updateCall[0].name).toBe('test.png');
        });
        
        test('handles file drop', () => {
            render(<SpotImagesCard imageFiles={[]} setImageFiles={mockSetImageFiles} />);

            const dropZone = screen.getByText('Click to upload or drag').closest('div')?.parentElement as HTMLElement;
            
            const file = new File([''], 'test2.png', { type: 'image/png' });
            
            fireEvent.drop(dropZone, {
                dataTransfer: {
                    files: [file]
                }
            });

            expect(mockSetImageFiles).toHaveBeenCalled();
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 3: IMAGE REMOVAL
    // ════════════════════════════════════════════════════
    describe('Image Removal', () => {
        test('removes image when close button is clicked', () => {
            const files = [
                new File([''], 'img1.jpg', { type: 'image/jpeg' }),
                new File([''], 'img2.jpg', { type: 'image/jpeg' }),
            ];

            const { container } = render(<SpotImagesCard imageFiles={files} setImageFiles={mockSetImageFiles} />);

            // Find the remove buttons (X icons inside buttons)
            const removeBtns = container.querySelectorAll('button.absolute');
            expect(removeBtns.length).toBe(2);

            // Click the first remove button
            fireEvent.click(removeBtns[0]);

            expect(mockSetImageFiles).toHaveBeenCalled();
            const updateCall = mockSetImageFiles.mock.calls[0][0];
            expect(updateCall.length).toBe(1);
            expect(updateCall[0].name).toBe('img2.jpg'); // img1 should be removed
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 4: SLIDER CONTROLS (>3 images)
    // ════════════════════════════════════════════════════
    describe('Slider Controls', () => {
        test('renders slider controls when > 3 images exist', () => {
            const files = [
                new File([''], 'img1.jpg', { type: 'image/jpeg' }),
                new File([''], 'img2.jpg', { type: 'image/jpeg' }),
                new File([''], 'img3.jpg', { type: 'image/jpeg' }),
                new File([''], 'img4.jpg', { type: 'image/jpeg' }),
            ];

            const { container } = render(<SpotImagesCard imageFiles={files} setImageFiles={mockSetImageFiles} />);

            // Should render exactly 3 images at a time
            const images = container.querySelectorAll('img');
            expect(images.length).toBe(3);

            // Find prev/next buttons (the ones with ChevronLeft/Right)
            // Using querySelectorAll to find the round buttons
            const sliderBtns = container.querySelectorAll('.w-10.h-10');
            expect(sliderBtns.length).toBe(2);
            
            // Prev should be disabled initially
            expect(sliderBtns[0]).toHaveProperty('disabled', true);
            // Next should be enabled
            expect(sliderBtns[1]).toHaveProperty('disabled', false);
        });
    });

    // ════════════════════════════════════════════════════
    // GROUP 5: READ-ONLY MODE
    // ════════════════════════════════════════════════════
    describe('Read-Only Mode', () => {
        test('hides upload UI and remove buttons in read-only mode', () => {
            const files = [
                new File([''], 'img1.jpg', { type: 'image/jpeg' }),
            ];

            const { container } = render(<SpotImagesCard imageFiles={files} setImageFiles={mockSetImageFiles} readOnly={true} />);

            expect(screen.queryByText('Click to upload or drag')).toBeNull();
            
            // Remove buttons should not be rendered
            const removeBtns = container.querySelectorAll('button.absolute');
            expect(removeBtns.length).toBe(0);
        });
    });
});
