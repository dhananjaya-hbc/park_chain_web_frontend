import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import VerificationHeader from '@/app/(protected)/admin/kyb/components/VerificationHeader'
import { VerificationFilterType } from '@/app/(protected)/admin/kyb/components/Main'

describe('VerificationHeader Component', () => {
    const mockFilterHook = {
        selectedFilter: 'all' as VerificationFilterType,
        isFilterOpen: false,
        setIsFilterOpen: jest.fn(),
        dropdownRef: React.createRef<HTMLDivElement>(),
        handleFilterSelect: jest.fn(),
    }

    const defaultProps = {
        filterHook: mockFilterHook,
        searchQuery: '',
        setSearchQuery: jest.fn(),
        sortOrder: 'newest' as 'newest' | 'oldest',
        setSortOrder: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should render header with title', () => {
        render(<VerificationHeader {...defaultProps} />)
        const title = screen.getByText(/Verification list/i)
        expect(title).toBeInTheDocument()
    })

    it('should render all filter option buttons', () => {
        render(<VerificationHeader {...defaultProps} />)
        expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Pending' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Approved' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Rejected' })).toBeInTheDocument()
    })

    it('should call handleFilterSelect when a filter button is clicked', () => {
        render(<VerificationHeader {...defaultProps} />)
        const pendingBtn = screen.getByRole('button', { name: 'Pending' })
        fireEvent.click(pendingBtn)
        expect(mockFilterHook.handleFilterSelect).toHaveBeenCalledWith('pending')
    })

    it('should highlight selected filter option', () => {
        const customFilterHook = {
            ...mockFilterHook,
            selectedFilter: 'verified' as VerificationFilterType,
        }
        render(<VerificationHeader {...defaultProps} filterHook={customFilterHook} />)
        const approvedOption = screen.getByRole('button', { name: 'Approved' })
        expect(approvedOption).toHaveClass('bg-[#197729]')
        expect(approvedOption).toHaveClass('text-white')
    })

    it('should render the compact pill buttons with appropriate styles', () => {
        render(<VerificationHeader {...defaultProps} />)
        expect(screen.getByRole('button', { name: 'Approved' })).toHaveClass('rounded-lg')
        expect(screen.getByRole('button', { name: 'Rejected' })).toHaveClass('bg-gray-100')
        expect(screen.getByRole('button', { name: 'Pending' })).toHaveClass('bg-gray-100')
    })

    it('should handle search input change', () => {
        render(<VerificationHeader {...defaultProps} />)
        const searchInput = screen.getByPlaceholderText(/Search entity, spot, address.../i)
        fireEvent.change(searchInput, { target: { value: 'Downtown' } })
        expect(defaultProps.setSearchQuery).toHaveBeenCalledWith('Downtown')
    })

    it('should handle sort order select change', () => {
        render(<VerificationHeader {...defaultProps} />)
        const select = screen.getByRole('combobox')
        fireEvent.change(select, { target: { value: 'oldest' } })
        expect(defaultProps.setSortOrder).toHaveBeenCalledWith('oldest')
    })

    it('should handle pending and rejected filter active styling', () => {
        const pendingHook = {
            ...mockFilterHook,
            selectedFilter: 'pending' as VerificationFilterType,
        }
        const { rerender } = render(<VerificationHeader {...defaultProps} filterHook={pendingHook} />)
        expect(screen.getByRole('button', { name: 'Pending' })).toHaveClass('bg-amber-100')

        const rejectedHook = {
            ...mockFilterHook,
            selectedFilter: 'rejected' as VerificationFilterType,
        }
        rerender(<VerificationHeader {...defaultProps} filterHook={rejectedHook} />)
        expect(screen.getByRole('button', { name: 'Rejected' })).toHaveClass('bg-red-100')
    })
})
