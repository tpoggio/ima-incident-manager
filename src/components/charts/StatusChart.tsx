import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from 'chart.js';
import { useTranslation } from 'react-i18next';
import type { DashboardStats } from '@/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StatusChartProps {
  stats: DashboardStats['porEstado'];
}

const COLORS = [
  '#3b82f6',
  '#f59e0b',
  '#8b5cf6',
  '#f97316',
  '#ec4899',
  '#6366f1',
  '#10b981',
  '#6b7280',
  '#ef4444',
];

export function StatusChart({ stats }: StatusChartProps) {
  const { t } = useTranslation();
  const labels = Object.keys(stats).map(key => t(`statuses.${key}`));
  const values = Object.values(stats);

  const data = {
    labels,
    datasets: [
      {
        label: t('charts.quantity'),
        data: values,
        backgroundColor: COLORS,
        borderColor: COLORS,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) =>
            `${t('charts.quantity')}: ${context.raw as number}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('charts.incidentsByStatus')}</h3>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
