import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/validation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const PriceChart = ({ forecastData, commodity = 'Crop' }) => {
  if (!forecastData || !forecastData.dates || forecastData.dates.length === 0) {
    return (
      <div className="p-8 text-center text-earth-muted bg-cream-50 rounded-xl border border-cream-300">
        No forecast timeline points available.
      </div>
    );
  }

  const chartData = {
    labels: forecastData.dates,
    datasets: [
      {
        label: 'Forecasted Modal Price (₹/Quintal)',
        data: forecastData.prices,
        fill: true,
        borderColor: '#2F5D50',
        backgroundColor: 'rgba(47, 93, 80, 0.08)',
        tension: 0.35,
        pointBackgroundColor: '#244B40',
        pointBorderColor: '#FDFCF9',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      ...(forecastData.min_prices
        ? [
            {
              label: 'Min Expected Rate (₹/Quintal)',
              data: forecastData.min_prices,
              borderColor: '#A4B69A',
              borderDash: [5, 5],
              fill: false,
              pointRadius: 3,
              pointBackgroundColor: '#879C7D',
              tension: 0.35,
            },
          ]
        : []),
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 11,
            family: "'Plus Jakarta Sans', sans-serif",
            weight: 500,
          },
          color: '#18231E',
        },
      },
      tooltip: {
        backgroundColor: '#18231E',
        titleColor: '#FDFCF9',
        bodyColor: '#DFE7DA',
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Rate (₹ per Quintal)',
          font: { size: 11, family: "'Plus Jakarta Sans', sans-serif", weight: 600 },
          color: '#526058',
        },
        ticks: {
          callback: (value) => `₹${value}`,
          color: '#7D8B84',
        },
        grid: {
          color: '#E6E0D4',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Timeline Date',
          font: { size: 11, family: "'Plus Jakarta Sans', sans-serif", weight: 600 },
          color: '#526058',
        },
        ticks: {
          color: '#7D8B84',
        },
        grid: {
          color: '#F4EFE6',
        },
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PriceChart;
