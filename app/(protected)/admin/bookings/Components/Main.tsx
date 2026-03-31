import React from 'react'
import BookingStatCards from './BookingStatCards'
import BookingFilters from './BookingFilters'
import BookingTable from './BookingTable'

export default function Main() {
    return (
        <>
            <BookingStatCards />
            <BookingFilters />
            <BookingTable />
        </>
    )
}