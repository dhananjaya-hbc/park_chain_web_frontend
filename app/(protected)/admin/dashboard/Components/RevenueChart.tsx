import React from 'react'
import dynamic from 'next/dynamic'

const RevenueLineChart = dynamic(
  () => import('@/components/charts/RevenueLineChart'),
  { ssr: false }
)

export default function RevenueChart() {
    return (
        <div className='mb-5'>
            <RevenueLineChart
                title="Revenue Analytics"
                labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
                datasets={[
                    {
                        label: "Revenue",
                        values: [1200, 1850, 1750, 2350, 2200, 2600, 3400, 3800, 4200, 3900, 4500, 5200],
                    },
                ]}
                showGrowthIndicator
                growthPercentage="+18%"
                currency="XRP"
                height="280"
            />
        </div>
    )
}