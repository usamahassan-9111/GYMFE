export default function StatCard({ label, value, accent = 'blue' }) {
  const accentClass = accent === 'red' ? 'from-rose-500/30 to-transparent' : 'from-blue-500/30 to-transparent';
  const glowClass = accent === 'red' ? 'glow-red' : 'glow-blue';

  return (
    <div className={`glass relative overflow-hidden rounded-3xl p-7 stat-card hover:scale-105 transition-all duration-300 ${glowClass} border-white/15`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${accentClass}`} />
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className={`absolute inset-0 rounded-3xl ${accent === 'red' ? 'bg-gradient-to-br from-rose-500/10 via-transparent to-transparent' : 'bg-gradient-to-br from-blue-500/10 via-transparent to-transparent'}`} />
      </div>
      <div className="relative">
        <p className="text-base font-semibold text-slate-300">{label}</p>
        <p className="mt-3 text-4xl font-black text-white">{value}</p>
      </div>
    </div>
  );
}