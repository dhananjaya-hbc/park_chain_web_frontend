import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminNotes from '@/app/(protected)/admin/kyb/[id]/components/AdminNotes'

describe('AdminNotes Component', () => {
    it('should render section title', () => {
        render(<AdminNotes />)
        
        const title = screen.getByText('Admin Notes')
        expect(title).toBeInTheDocument()
        expect(title).toHaveClass('text-2xl')
        expect(title).toHaveClass('font-bold')
    })

    it('should render textarea with placeholder', () => {
        render(<AdminNotes />)
        
        const textarea = screen.getByPlaceholderText(/Add any notes or observations/)
        expect(textarea).toBeInTheDocument()
    })

    it('should render save button', () => {
        render(<AdminNotes />)
        
        const saveButton = screen.getByRole('button')
        expect(saveButton).toBeInTheDocument()
    })

    it('should initialize textarea with initial notes', () => {
        const initialNotes = 'This is a test note'
        render(<AdminNotes initialNotes={initialNotes} />)
        
        const textarea = screen.getByDisplayValue(initialNotes)
        expect(textarea).toBeInTheDocument()
    })

    it('should update textarea value on user input', () => {
        render(<AdminNotes />)
        
        const textarea = screen.getByPlaceholderText(/Add any notes or observations/) as HTMLTextAreaElement
        fireEvent.change(textarea, { target: { value: 'New note text' } })
        
        expect(textarea.value).toBe('New note text')
    })

    it('should call onSave callback when save button is clicked', async () => {
        const mockOnSave = jest.fn()
        render(<AdminNotes initialNotes="Test" onSave={mockOnSave} />)
        
        const saveButton = screen.getByRole('button')
        fireEvent.click(saveButton)
        
        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledWith('Test')
        })
    })

    it('should call onSave with updated note value', async () => {
        const mockOnSave = jest.fn()
        render(<AdminNotes onSave={mockOnSave} />)
        
        const textarea = screen.getByPlaceholderText(/Add any notes or observations/) as HTMLTextAreaElement
        fireEvent.change(textarea, { target: { value: 'Updated note' } })
        
        const saveButton = screen.getByRole('button')
        fireEvent.click(saveButton)
        
        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledWith('Updated note')
        })
    })

    it('should disable save button during save operation', async () => {
        const mockOnSave = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
        render(<AdminNotes onSave={mockOnSave} />)
        
        const saveButton = screen.getByRole('button') as HTMLButtonElement
        fireEvent.click(saveButton)
        
        expect(saveButton).toBeDisabled()
        
        await waitFor(() => {
            expect(saveButton).not.toBeDisabled()
        })
    })

    it('should have green border accent on title', () => {
        render(<AdminNotes />)
        
        const title = screen.getByText('Admin Notes')
        expect(title).toHaveClass('border-b-2')
        expect(title).toHaveClass('border-green-600')
    })

    it('should have proper textarea styling', () => {
        render(<AdminNotes />)
        
        const textarea = screen.getByPlaceholderText(/Add any notes or observations/)
        expect(textarea).toHaveClass('w-full')
        expect(textarea).toHaveClass('border-2')
        expect(textarea).toHaveClass('border-gray-200')
        expect(textarea).toHaveClass('rounded-xl')
        expect(textarea).toHaveClass('p-4')
    })

    it('should have proper button styling', () => {
        render(<AdminNotes />)
        
        const saveButton = screen.getByRole('button')
        expect(saveButton).toHaveClass('bg-green-600')
        expect(saveButton).toHaveClass('hover:bg-green-700')
        expect(saveButton).toHaveClass('text-white')
        expect(saveButton).toHaveClass('font-semibold')
        expect(saveButton).toHaveClass('px-8')
        expect(saveButton).toHaveClass('py-3')
    })

    it('should focus on textarea with green border on focus', () => {
        render(<AdminNotes />)
        
        const textarea = screen.getByPlaceholderText(/Add any notes or observations/)
        expect(textarea).toHaveClass('focus:border-green-600')
    })

    it('should handle empty notes submission', async () => {
        const mockOnSave = jest.fn()
        render(<AdminNotes initialNotes="" onSave={mockOnSave} />)
        
        const saveButton = screen.getByRole('button')
        fireEvent.click(saveButton)
        
        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledWith('')
        })
    })

    it('should handle long notes text', async () => {
        const longNotes = 'A'.repeat(500)
        const mockOnSave = jest.fn()
        
        render(<AdminNotes initialNotes={longNotes} onSave={mockOnSave} />)
        
        const textarea = screen.getByDisplayValue(longNotes)
        expect(textarea).toBeInTheDocument()
        
        const saveButton = screen.getByRole('button')
        fireEvent.click(saveButton)
        
        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledWith(longNotes)
        })
    })

    it('should not call onSave if onSave callback is not provided', async () => {
        render(<AdminNotes />)
        
        const saveButton = screen.getByRole('button')
        fireEvent.click(saveButton)
        
        // Should not throw error, just execute without callback
        await waitFor(() => {
            expect(saveButton).not.toBeDisabled()
        })
    })

    it('should handle multiple save operations', async () => {
        const mockOnSave = jest.fn()
        render(<AdminNotes onSave={mockOnSave} />)
        
        const textarea = screen.getByPlaceholderText(/Add any notes or observations/) as HTMLTextAreaElement
        const saveButton = screen.getByRole('button')
        
        // First save
        fireEvent.change(textarea, { target: { value: 'First note' } })
        fireEvent.click(saveButton)
        
        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledWith('First note')
        })
        
        // Second save
        fireEvent.change(textarea, { target: { value: 'Second note' } })
        fireEvent.click(saveButton)
        
        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledWith('Second note')
        })
        
        expect(mockOnSave).toHaveBeenCalledTimes(2)
    })

            it('should log error when save callback throws', async () => {
                const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
                const mockOnSave = jest.fn().mockRejectedValue(new Error('save failed'))

                render(<AdminNotes onSave={mockOnSave} />)

                fireEvent.click(screen.getByRole('button'))

                await waitFor(() => {
                    expect(errorSpy).toHaveBeenCalled()
                })

                errorSpy.mockRestore()
            })
})
