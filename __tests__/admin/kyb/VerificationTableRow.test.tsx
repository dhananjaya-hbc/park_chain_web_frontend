import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import VerificationTableRow from '@/app/(protected)/admin/kyb/components/VerificationTableRow'

// Mock Next.js Link component
jest.mock('next/link', () => {
    const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    )
    MockLink.displayName = 'MockLink'
    return MockLink
})

// Mock StatusBadge component
jest.mock('@/app/(protected)/admin/kyb/components/StatusBadge', () => {
    return function MockStatusBadge({ status }: { status: string }) {
        return <div data-testid={`status-badge-${status}`}>{status}</div>
    }
})

describe('VerificationTableRow Component', () => {
    const mockRowData = {
        id: 1,
        entityName: 'City Center Plaza',
        spotType: 'Garage',
        address: '123 Main Street, Austin, TX 73301, USA',
        date: '2025-01-15',
        status: 'pending' as const,
    }

    it('should render table row with all data', () => {
        const { container } = render(<VerificationTableRow {...mockRowData} />)
        
        const tr = container.querySelector('tr')
        expect(tr).toBeInTheDocument()
        expect(tr).toHaveClass('bg-white')
    })

    it('should display entity name with building icon', () => {
        render(<VerificationTableRow {...mockRowData} />)
        
        const entityName = screen.getByText('City Center Plaza')
        expect(entityName).toBeInTheDocument()
        expect(entityName).toHaveClass('font-semibold')
        
        const icon = entityName.parentElement?.querySelector('i')
        expect(icon).toHaveClass('ri-building-4-fill')
    })

    it('should display spot type capitalized', () => {
        render(<VerificationTableRow {...mockRowData} />)
        
        const spotType = screen.getByText('Garage')
        expect(spotType).toBeInTheDocument()
        expect(spotType).toHaveClass('capitalize')
    })

    it('should display address with date', () => {
        render(<VerificationTableRow {...mockRowData} />)
        
        const address = screen.getByText('123 Main Street, Austin, TX 73301, USA')
        expect(address).toBeInTheDocument()
        expect(address).toHaveClass('truncate')
        
        const date = screen.getByText('2025-01-15')
        expect(date).toBeInTheDocument()
    })

    it('should render status badge component', () => {
        render(<VerificationTableRow {...mockRowData} />)
        
        const statusBadge = screen.getByTestId('status-badge-pending')
        expect(statusBadge).toBeInTheDocument()
    })

    it('should render with verified status', () => {
        render(<VerificationTableRow {...mockRowData} status="verified" />)
        
        const statusBadge = screen.getByTestId('status-badge-verified')
        expect(statusBadge).toBeInTheDocument()
    })

    it('should render with rejected status', () => {
        render(<VerificationTableRow {...mockRowData} status="rejected" />)
        
        const statusBadge = screen.getByTestId('status-badge-rejected')
        expect(statusBadge).toBeInTheDocument()
    })

    it('should truncate long addresses', () => {
        const longAddress = 'Very long address that should be truncated because it exceeds maximum width ' + 'x'.repeat(100)
        render(
            <VerificationTableRow
                {...mockRowData}
                address={longAddress}
            />
        )
        
        const address = screen.getByText(longAddress)
        expect(address).toHaveClass('truncate')
        expect(address).toHaveClass('max-w-[200px]')
    })

    it('should have address title attribute for full text on hover', () => {
        render(<VerificationTableRow {...mockRowData} />)
        
        const address = screen.getByTitle('123 Main Street, Austin, TX 73301, USA')
        expect(address).toBeInTheDocument()
    })

    it('should render with proper table cell structure', () => {
        const { container } = render(<VerificationTableRow {...mockRowData} />)
        
        const cells = container.querySelectorAll('td')
        expect(cells).toHaveLength(5) // entityName, spotType, address+date, status, action
        
        cells.forEach(cell => {
            expect(cell).toHaveClass('px-6')
            expect(cell).toHaveClass('py-4')
        })
    })
})
