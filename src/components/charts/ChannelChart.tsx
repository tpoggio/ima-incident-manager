import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type TooltipItem } from 'chart.js';
import { useTranslation } from 'react-i18next';
import type { DashboardStats } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChannelChartProps {
  stats: DashboardStats['porCanal'];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function ChannelChart({ stats }: ChannelChartProps) {
  const { t } = useTranslation();
  const labels = Object.keys(stats).map(key => t(`channels.${key}`));
  const values = Object.values(stats);
  const total = values.reduce((a, b) => a + b, 0);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS,
        borderColor: COLORS.map(c => c),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'pie'>) => {
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('charts.incidentsByChannel')}</h3>
      <div className="h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
