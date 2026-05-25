import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import StatusBadge from '@/app/(protected)/admin/kyb/components/StatusBadge'

describe('StatusBadge Component', () => {
    it('should render pending status with correct badge and label', () => {
        render(<StatusBadge status="pending" />)
        
        const label = screen.getByText('Pending')
        expect(label).toBeInTheDocument()
        expect(label).toHaveClass('bg-yellow-100')
        expect(label).toHaveClass('text-yellow-800')
    })

    it('should render verified status with correct badge and label', () => {
        render(<StatusBadge status="verified" />)
        
        const label = screen.getByText('Verified')
        expect(label).toBeInTheDocument()
        expect(label).toHaveClass('bg-green-100')
        expect(label).toHaveClass('text-green-800')
    })

    it('should render rejected status with correct badge and label', () => {
        render(<StatusBadge status="rejected" />)
        
        const label = screen.getByText('Rejected')
        expect(label).toBeInTheDocument()
        expect(label).toHaveClass('bg-red-100')
        expect(label).toHaveClass('text-red-800')
    })

    it('should apply compact badge layout for pending status', () => {
        render(<StatusBadge status="pending" />)
        
        const label = screen.getByText('Pending')
        expect(label).toHaveClass('inline-flex')
        expect(label).toHaveClass('text-xs')
        expect(label).toHaveClass('rounded-full')
    })

    it('should render badge with centered layout classes', () => {
        const { container } = render(<StatusBadge status="pending" />)
        
        const badge = container.querySelector('span')
        expect(badge).toHaveClass('justify-center')
    })
})
