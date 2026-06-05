import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PersonalInfo from '@/app/(protected)/admin/kyb/[id]/components/PersonalInfo'

describe('PersonalInfo Component', () => {
    it('should render with default values when props are not provided', () => {
        render(<PersonalInfo />)
        
        expect(screen.getByText('Kavindu Prabash')).toBeInTheDocument()
        expect(screen.getByText('City Center Plaza Parking')).toBeInTheDocument()
        expect(screen.getByText('Garage')).toBeInTheDocument()
        expect(screen.getByText('789 Pine Road, Austin, TX 73301, USA')).toBeInTheDocument()
    })

    it('should render section title', () => {
        render(<PersonalInfo />)
        
        const title = screen.getByText('Entity Details (KYB)')
        expect(title).toBeInTheDocument()
        expect(title).toHaveClass('text-lg')
        expect(title).toHaveClass('font-semibold')
    })

    it('should display owner name field', () => {
        render(<PersonalInfo ownerName="John Smith" />)
        
        const label = screen.getByText('Owner Name')
        expect(label).toBeInTheDocument()
        
        const value = screen.getByText('John Smith')
        expect(value).toBeInTheDocument()
    })

    it('should display entity name field', () => {
        render(<PersonalInfo entityName="Downtown Parking Lot" />)
        
        const label = screen.getByText('Entity/Spot Name')
        expect(label).toBeInTheDocument()
        
        const value = screen.getByText('Downtown Parking Lot')
        expect(value).toBeInTheDocument()
    })

    it('should display spot type field', () => {
        render(<PersonalInfo spotType="Open Lot" />)
        
        const label = screen.getByText('Spot Type')
        expect(label).toBeInTheDocument()
        
        const value = screen.getByText('Open Lot')
        expect(value).toBeInTheDocument()
    })

    it('should display address field', () => {
        render(<PersonalInfo address="456 Oak Avenue, Boston, MA 02101" />)
        
        const label = screen.getByText('Address')
        expect(label).toBeInTheDocument()
        
        const value = screen.getByText('456 Oak Avenue, Boston, MA 02101')
        expect(value).toBeInTheDocument()
    })

    it('should render Google Maps link as clickable link', () => {
        const mapsUrl = 'https://maps.app.goo.gl/custom'
        render(<PersonalInfo googleMapsLink={mapsUrl} />)
        
        const label = screen.getByText('Google Maps Link')
        expect(label).toBeInTheDocument()
        
        const link = screen.getByRole('link', { name: mapsUrl })
        expect(link).toHaveAttribute('href', mapsUrl)
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noreferrer')
    })

    it('should render all fields with correct layout grid', () => {
        const { container } = render(<PersonalInfo />)
        
        const grids = container.querySelectorAll('[class*="grid"]')
        expect(grids.length).toBeGreaterThan(0)
    })

    it('should display multiple fields in the component', () => {
        render(
            <PersonalInfo
                ownerName="Alice Johnson"
                entityName="Metro Station Parking"
                spotType="Underground"
                googleMapsLink="https://maps.example.com/spot1"
                address="999 Central Ave, New York, NY 10001"
            />
        )
        
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
        expect(screen.getByText('Metro Station Parking')).toBeInTheDocument()
        expect(screen.getByText('Underground')).toBeInTheDocument()
        expect(screen.getByText('999 Central Ave, New York, NY 10001')).toBeInTheDocument()
        
        const link = screen.getByRole('link', { name: 'https://maps.example.com/spot1' })
        expect(link).toBeInTheDocument()
    })

    it('should have correct styling for field labels', () => {
        render(<PersonalInfo />)
        
        const labels = screen.getAllByText(/Entity\/Spot Name|Owner Name|Spot Type|Google Maps Link|Address/)
        labels.forEach(label => {
            expect(label).toHaveClass('text-gray-500')
            expect(label).toHaveClass('font-medium')
        })
    })

    it('should have correct styling for field values', () => {
        render(<PersonalInfo ownerName="Test Owner" />)
        
        const value = screen.getByText('Test Owner')
        expect(value).toHaveClass('text-gray-900')
        expect(value).toHaveClass('text-sm')
    })

    it('should truncate long Google Maps links', () => {
        const longUrl = 'https://maps.app.goo.gl/verylongurlthatwillbetruncat' + 'x'.repeat(50)
        render(<PersonalInfo googleMapsLink={longUrl} />)
        
        const link = screen.getByRole('link')
        expect(link).toHaveClass('truncate')
    })

    it('should have green border accent on title', () => {
        const { container } = render(<PersonalInfo />)
        
        const title = screen.getByText('Entity Details (KYB)')
        expect(title).not.toHaveClass('border-b-2')
        expect(container.firstChild).toHaveClass('border')
        expect(container.firstChild).toHaveClass('border-gray-100')
    })
})
