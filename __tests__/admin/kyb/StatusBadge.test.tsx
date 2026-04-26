import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import StatusBadge from '@/app/(protected)/admin/kyb/components/StatusBadge'

describe('StatusBadge Component', () => {
    it('should render pending status with correct icon and label', () => {
        render(<StatusBadge status="pending" />)
        
        const label = screen.getByText('Pending')
        expect(label).toBeInTheDocument()
        
        const icon = screen.getByText('Pending').parentElement?.querySelector('i')
        expect(icon).toHaveClass('ri-time-fill')
        expect(icon).toHaveClass('text-amber-500')
    })

    it('should render verified status with correct icon and label', () => {
        render(<StatusBadge status="verified" />)
        
        const label = screen.getByText('Verified')
        expect(label).toBeInTheDocument()
        
        const icon = screen.getByText('Verified').parentElement?.querySelector('i')
        expect(icon).toHaveClass('ri-checkbox-circle-fill')
        expect(icon).toHaveClass('text-green-600')
    })

    it('should render rejected status with correct icon and label', () => {
        render(<StatusBadge status="rejected" />)
        
        const label = screen.getByText('Rejected')
        expect(label).toBeInTheDocument()
        
        const icon = screen.getByText('Rejected').parentElement?.querySelector('i')
        expect(icon).toHaveClass('ri-close-circle-fill')
        expect(icon).toHaveClass('text-red-600')
    })

    it('should apply correct icon size for pending status', () => {
        render(<StatusBadge status="pending" />)
        
        const icon = screen.getByText('Pending').parentElement?.querySelector('i')
        expect(icon).toHaveClass('text-base')
    })

    it('should apply correct icon size for verified status', () => {
        render(<StatusBadge status="verified" />)
        
        const icon = screen.getByText('Verified').parentElement?.querySelector('i')
        expect(icon).toHaveClass('text-lg')
    })

    it('should apply correct icon size for rejected status', () => {
        render(<StatusBadge status="rejected" />)
        
        const icon = screen.getByText('Rejected').parentElement?.querySelector('i')
        expect(icon).toHaveClass('text-lg')
    })

    it('should render badge with flex and gap classes for layout', () => {
        const { container } = render(<StatusBadge status="pending" />)
        
        const div = container.querySelector('div')
        expect(div).toHaveClass('flex')
        expect(div).toHaveClass('items-center')
        expect(div).toHaveClass('justify-center')
        expect(div).toHaveClass('gap-2')
    })
})
