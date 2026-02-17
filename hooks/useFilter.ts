import { useState, useRef, useEffect } from 'react'

export function useFilter<T extends string>(initialFilter: T) {
    const [selectedFilter, setSelectedFilter] = useState<T>(initialFilter)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false)
            }
        }

        if (isFilterOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isFilterOpen])

    const handleFilterSelect = (filter: T) => {
        setSelectedFilter(filter)
        setIsFilterOpen(false)
    }

    return {
        selectedFilter,
        setSelectedFilter,
        isFilterOpen,
        setIsFilterOpen,
        dropdownRef,
        handleFilterSelect
    }
}
