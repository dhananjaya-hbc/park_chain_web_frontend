"use client"
import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function MyChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [1200, 1850, 1750, 2350, 2200, 2600, 3400, 3800, 4200, 3900, 4500, 5200],
        borderColor: '#197729',
        backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D } }) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 300)
          gradient.addColorStop(0, 'rgba(6, 202, 39, 0.2)')
          gradient.addColorStop(1, 'rgba(6, 202, 39, 0.01)')
          return gradient
        },
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#197729',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#fff',
        titleColor: '#212529',
        bodyColor: '#4f586d',
        borderColor: '#dfe0e4',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function(context: { parsed: { y: number | null } }) {
            return (context.parsed.y ?? 0).toLocaleString() + ' XRP'
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#4f586d',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: '#f0f0f0',
          drawBorder: false,
        },
        ticks: {
          color: '#4f586d',
          font: {
            size: 12,
          },
          callback: function(value: number | string) {
            return value.toLocaleString() + ' XRP'
          },
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  }

  return (
    <div className='p-5 rounded-xl bg-white shadow-xl'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='font-semibold text-xl font-sora'>Revenue Analytics</h3>
        <div className='flex items-center gap-3'>
          <span className='text-sm text-[#4f586d] font-sora'>This Year</span>
          <span className='px-3 py-1 bg-green-50 text-[#197729] rounded-full text-sm font-medium font-sora'>+18%</span>
        </div>
      </div>
      <div className='h-75'>
        <Line data={data} options={options} />
      </div>
    </div>
  )
}