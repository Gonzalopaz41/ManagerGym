interface Props {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  iconColor?: string;
  loading?: boolean;
}

const KpiCard = ({ label, value, icon: Icon, iconColor = '#888888', loading = false }: Props) => (
  <div className="border border-[#222222] rounded-[8px] bg-[#111111] p-5 flex items-start gap-4">
    <div className="p-2 rounded-[6px] bg-[#0a0a0a] border border-[#222222] shrink-0">
      <Icon size={18} style={{ color: iconColor }} />
    </div>
    <div>
      <p className="text-xs text-[#888888] mb-1">{label}</p>
      {loading ? (
        <div className="h-7 w-24 bg-[#1a1a1a] rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
      )}
    </div>
  </div>
);

export default KpiCard;
