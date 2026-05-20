import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  target?: number;
  suffix?: string;
  icon?: React.ReactNode;
  color?: string;
  small?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, target, suffix = '', icon, color = '#f59e0b', small }) => {
  const numValue = typeof value === 'number' ? value : parseFloat(value as string);
  const variance = target && target > 0 ? ((numValue - target) / target) * 100 : null;
  const pct = target && target > 0 ? Math.min((numValue / target) * 100, 100) : null;

  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${small ? 'p-3' : 'p-5'} flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <span className={`${small ? 'text-xs' : 'text-sm'} font-medium text-gray-500`}>{title}</span>
        {icon && <span style={{ color }}>{icon}</span>}
      </div>
      <div className="flex items-end justify-between">
        <span className={`${small ? 'text-xl' : 'text-3xl'} font-bold text-gray-800`}>
          {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </span>
        {variance !== null && (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            variance > 0 ? 'bg-green-50 text-green-700' : variance < 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'
          }`}>
            {variance > 0 ? <TrendingUp size={12} /> : variance < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
            {Math.abs(variance).toFixed(1)}%
          </span>
        )}
      </div>
      {target !== undefined && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Target: {target.toLocaleString()}{suffix}</span>
            {pct !== null && <span>{pct.toFixed(0)}%</span>}
          </div>
          {pct !== null && (
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? '#10b981' : pct >= 70 ? color : '#ef4444' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KPICard;
