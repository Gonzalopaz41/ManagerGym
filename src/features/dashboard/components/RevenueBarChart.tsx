import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { DashboardPayment } from '../types/dashboard.types';

interface Props {
  payments: DashboardPayment[];
}

const getLast6Months = () => {
  const result = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    result.push({
      year:  d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleDateString('es-AR', { month: 'short' }).replace('.', ''),
    });
  }
  return result;
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(n);

const RevenueBarChart = ({ payments }: Props) => {
  const data = getLast6Months().map(({ year, month, label }) => ({
    label,
    total: payments
      .filter((p) => {
        const d = new Date(p.paymentDate);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .reduce((sum, p) => sum + Number(p.amount), 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#1a1a1a" />
        <XAxis
          dataKey="label"
          tick={{ fill: '#888888', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#888888', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v === 0 ? '0' : `$${(v / 1000).toFixed(0)}k`)}
          width={38}
        />
        <Tooltip
          contentStyle={{
            background: '#111111',
            border: '1px solid #222222',
            borderRadius: 6,
            color: '#ffffff',
            fontSize: 12,
          }}
          formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Recaudado']}
          cursor={{ fill: '#ffffff08' }}
        />
        <Bar dataKey="total" fill="#ffffff" radius={[3, 3, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueBarChart;
