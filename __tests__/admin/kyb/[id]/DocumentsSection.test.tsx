import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import DocumentsSection from '@/app/(protected)/admin/kyb/[id]/components/DocumentsSection'

describe('DocumentsSection Component', () => {
    const defaultImageUrl = 'https://res.cloudinary.com/dgcqzodby/image/upload/v1771232008/image3_zbobvi.png'

    it('should render section title', () => {
        render(<DocumentsSection />)
        
        const title = screen.getByText('Verification Document')
        expect(title).toBeInTheDocument()
        expect(title).toHaveClass('text-2xl')
        expect(title).toHaveClass('font-bold')
    })

    it('should render document card with title', () => {
        render(<DocumentsSection />)
        
        const cardTitle = screen.getByText('Proof of Ownership/Residency (Utility Bill/Deed)')
        expect(cardTitle).toBeInTheDocument()
    })

    it('should render image with provided URL', () => {
        const customUrl = 'https://example.com/document.png'
        render(<DocumentsSection documentUrl={customUrl} />)
        
        const image = screen.getByRole('img', { name: /Proof of Ownership/i })
        expect(image).toHaveAttribute('src', customUrl)
    })

    it('should render image with default URL when documentUrl is not provided', () => {
        render(<DocumentsSection />)
        
        const image = screen.getByRole('img', { name: /Proof of Ownership/i })
        expect(image).toHaveAttribute('src', defaultImageUrl)
    })

    it('should render image with alt text', () => {
        render(<DocumentsSection />)
        
        const image = screen.getByRole('img')
        expect(image).toHaveAttribute('alt', 'Proof of Ownership/Residency (Utility Bill/Deed)')
    })

    it('should render full size document link', () => {
        const customUrl = 'https://example.com/mydoc.pdf'
        render(<DocumentsSection documentUrl={customUrl} />)
        
        const link = screen.getByRole('link', { name: /View Full Size Document/i })
        expect(link).toHaveAttribute('href', customUrl)
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noreferrer')
    })

    it('should render full size link with arrow symbol', () => {
        render(<DocumentsSection />)
        
        const link = screen.getByRole('link')
        expect(link.textContent).toContain('View Full Size Document ↗')
    })

    it('should have proper styling for document card', () => {
        const { container } = render(<DocumentsSection />)
        
        const card = container.querySelector('[class*="bg-gray-50"]')
        expect(card).toHaveClass('rounded-2xl')
        expect(card).toHaveClass('p-5')
    })

    it('should have image container with proper height', () => {
        const { container } = render(<DocumentsSection />)
        
        const imageContainer = container.querySelector('[class*="h-64"]')
        expect(imageContainer).toBeInTheDocument()
        expect(imageContainer).toHaveClass('h-64')
    })

    it('should display image with object-contain sizing', () => {
        const { container } = render(<DocumentsSection />)
        
        const image = container.querySelector('img')
        expect(image).toHaveClass('object-contain')
        expect(image).toHaveClass('w-full')
        expect(image).toHaveClass('h-full')
    })

    it('should render multiple document cards if needed', () => {
        render(<DocumentsSection documentUrl="https://example.com/doc1.png" />)
        
        const images = screen.getAllByRole('img')
        expect(images.length).toBeGreaterThanOrEqual(1)
    })

    it('should have green border accent on title', () => {
        const { container } = render(<DocumentsSection />)
        
        const title = screen.getByText('Verification Document')
        expect(title).toHaveClass('border-b-2')
        expect(title).toHaveClass('border-green-600')
    })

    it('should have proper spacing between sections', () => {
        const { container } = render(<DocumentsSection />)
        
        const section = container.querySelector('[class*="mb-10"]')
        expect(section).toBeInTheDocument()
    })

    it('should handle undefined documentUrl gracefully', () => {
        render(<DocumentsSection documentUrl={undefined} />)
        
        const image = screen.getByRole('img')
        expect(image).toHaveAttribute('src', defaultImageUrl)
    })

    it('should link to full size document with blue color', () => {
        render(<DocumentsSection />)
        
        const link = screen.getByRole('link')
        expect(link).toHaveClass('text-blue-600')
        expect(link).toHaveClass('hover:text-blue-800')
    })
})
