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

    beforeEach(() => {
        jest.clearAllMocks()
    })

    const getFilterDropdown = () => {
        const filterButton = screen.getByRole('button', { name: /Filter/i })
        const filterContainer = filterButton.parentElement as HTMLElement
        return within(filterContainer)
    }

    it('should render header with title', () => {
        render(<VerificationHeader filterHook={mockFilterHook} />)
        
        const title = screen.getByText(/Verification list/i)
        expect(title).toBeInTheDocument()
    })

    it('should render filter button', () => {
        render(<VerificationHeader filterHook={mockFilterHook} />)
        
        const filterButton = screen.getByRole('button', { name: /Filter/i })
        expect(filterButton).toBeInTheDocument()
    })

    it('should show filter dropdown when isFilterOpen is true', () => {
        const mockHookOpen = {
            ...mockFilterHook,
            isFilterOpen: true,
        }
        
        render(<VerificationHeader filterHook={mockHookOpen} />)
        
        const allOption = screen.getByRole('button', { name: 'All' })
        expect(allOption).toBeInTheDocument()
    })

    it('should not show filter dropdown when isFilterOpen is false', () => {
        render(<VerificationHeader filterHook={mockFilterHook} />)
        
        const allOption = screen.queryByRole('button', { name: 'All' })
        expect(allOption).not.toBeInTheDocument()
    })

    it('should toggle filter dropdown on button click', () => {
        render(<VerificationHeader filterHook={mockFilterHook} />)
        
        const filterButton = screen.getByRole('button', { name: /Filter/i })
        fireEvent.click(filterButton)
        
        expect(mockFilterHook.setIsFilterOpen).toHaveBeenCalledWith(true)
    })

    it('should display all filter options when dropdown is open', () => {
        const mockHookOpen = {
            ...mockFilterHook,
            isFilterOpen: true,
        }
        
        render(<VerificationHeader filterHook={mockHookOpen} />)

        const dropdown = getFilterDropdown()
        expect(dropdown.getByRole('button', { name: 'All' })).toBeInTheDocument()
        expect(dropdown.getByRole('button', { name: 'Pending' })).toBeInTheDocument()
        expect(dropdown.getByRole('button', { name: 'Approved' })).toBeInTheDocument()
        expect(dropdown.getByRole('button', { name: 'Rejected' })).toBeInTheDocument()
    })

    it('should call handleFilterSelect when filter option is clicked', () => {
        const mockHookOpen = {
            ...mockFilterHook,
            isFilterOpen: true,
        }
        
        render(<VerificationHeader filterHook={mockHookOpen} />)

        const dropdown = getFilterDropdown()
        const pendingOption = dropdown.getByRole('button', { name: 'Pending' })
        fireEvent.click(pendingOption)
        
        expect(mockFilterHook.handleFilterSelect).toHaveBeenCalledWith('pending')
    })

    it('should highlight selected filter option', () => {
        const mockHookOpen = {
            ...mockFilterHook,
            isFilterOpen: true,
            selectedFilter: 'verified' as VerificationFilterType,
        }
        
        render(<VerificationHeader filterHook={mockHookOpen} />)

        const dropdown = getFilterDropdown()
        const approvedOption = dropdown.getByRole('button', { name: 'Approved' })
        expect(approvedOption).toHaveClass('bg-green-50')
        expect(approvedOption).toHaveClass('text-green-700')
        expect(approvedOption).toHaveClass('font-medium')
    })

    it('should not highlight non-selected filter options', () => {
        const mockHookOpen = {
            ...mockFilterHook,
            isFilterOpen: true,
            selectedFilter: 'verified' as VerificationFilterType,
        }
        
        render(<VerificationHeader filterHook={mockHookOpen} />)

        const dropdown = getFilterDropdown()
        const pendingOption = dropdown.getByRole('button', { name: 'Pending' })
        expect(pendingOption).not.toHaveClass('bg-green-50')
        expect(pendingOption).toHaveClass('text-gray-700')
    })

    it('should render filter icon in button', () => {
        const { container } = render(<VerificationHeader filterHook={mockFilterHook} />)
        
        const icon = container.querySelector('.ri-menu-line')
        expect(icon).toBeInTheDocument()
    })

    it('should handle different selected filters', () => {
        const mockHookOpen = {
            ...mockFilterHook,
            isFilterOpen: true,
            selectedFilter: 'pending' as VerificationFilterType,
        }
        
        render(<VerificationHeader filterHook={mockHookOpen} />)

        const dropdown = getFilterDropdown()
        const pendingOption = dropdown.getByRole('button', { name: 'Pending' })
        expect(pendingOption).toHaveClass('bg-green-50')
        
        fireEvent.click(pendingOption)
        expect(mockFilterHook.handleFilterSelect).toHaveBeenCalledWith('pending')
    })
})
