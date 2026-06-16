import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  active: number;
  expired: number;
  archived: number;
}

const SEGMENTS = [
  { key: 'active',   name: 'Activo',    color: '#00cc88' },
  { key: 'expired',  name: 'Vencido',   color: '#ff4444' },
  { key: 'archived', name: 'Archivado', color: '#444444' },
];

const MembershipDonut = ({ active, expired, archived }: Props) => {
  const values = { active, expired, archived };
  const data = SEGMENTS
    .map((s) => ({ name: s.name, value: values[s.key as keyof typeof values], color: s.color }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center">
        <p className="text-sm text-[#888888]">Sin datos</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={58}
          outerRadius={88}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#111111',
            border: '1px solid #222222',
            borderRadius: 6,
            color: '#ffffff',
            fontSize: 12,
          }}
          formatter={(value: number, name: string) => [value, name]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: '#888888', fontSize: 12 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MembershipDonut;
