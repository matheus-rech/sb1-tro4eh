import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { calculateSampleSize } from '../utils/calculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SampleSizeChartProps {
  sigma: number;
  alpha: number;
  power: number;
  dropoutRate: number;
  designEffect: number;
  selectedMethod: string;
}

const SampleSizeChart: React.FC<SampleSizeChartProps> = ({
  sigma,
  alpha,
  power,
  dropoutRate,
  designEffect,
  selectedMethod,
}) => {
  const effectSizes = [];
  const sampleSizes = [];

  // Set effect size range based on method
  const minEffectSize = selectedMethod === 'Andrews' ? 1 : 0.1;
  const maxEffectSize = 5;
  const stepSize = 0.1;

  for (let delta = minEffectSize; delta <= maxEffectSize; delta += stepSize) {
    effectSizes.push(delta.toFixed(1));
    const n = calculateSampleSize(
      delta,
      sigma,
      alpha,
      power,
      dropoutRate,
      designEffect
    );
    sampleSizes.push(n);
  }

  const data = {
    labels: effectSizes,
    datasets: [
      {
        label: 'Sample Size per Group',
        data: sampleSizes,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Effect Size (Δ)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Sample Size per Group',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mt-8">
      <Line data={data} options={options} />
    </div>
  );
};

export default SampleSizeChart;