const heroImage = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd';

export default function Hero({ onExplore }) {
  return (
    <section id="home" className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 blur-[1px]"
        style={{ backgroundImage: `url('${heroImage}?w=1600&h=1200&fit=crop')` }}
      />
      <div className="absolute inset-0 bg-hero-grid" />

      <div className="relative mx-auto grid min-h-[82vh] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="animate-slideIn">
          <span className="inline-flex rounded-full border border-sfRed/40 bg-sfRed/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">
            Full access gym management
          </span>
          <h2 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-7xl">
            Build, manage, and grow <span className="text-sfRed">SF SMART FITNESS</span> with a modern control panel.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Manage members, plans, attendance, payments, trainers, workout plans, diet plans, and notifications from one fast mobile-friendly dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#plans" className="rounded-full bg-gradient-to-r from-sfBlue to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition hover:scale-105 text-center">
              View Membership Plans
            </a>
            <a href="#supplements" className="rounded-full bg-gradient-to-r from-sfRed to-rose-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl transition hover:scale-105 text-center">
              Supplements & Products
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ['2500', 'Monthly Fee'],
              ['5000', 'Personal Trainer'],
              ['2000', 'Cardio Area'],
              ['AC', 'Full Air-Conditioned'],
            ].map(([value, label]) => (
              <div key={label} className="glass rounded-2xl p-4 text-center animate-float">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-300">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="glass overflow-hidden rounded-[4rem] p-2 shadow-3xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.9rem]">
              <img
                src={heroImage}
                alt="Gym interior"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Premium Zone</p>
                <h3 className="mt-1 text-2xl font-bold text-white">New machines, cardio area, premium training space</h3>
                <p className="mt-2 text-sm text-slate-300">A strong blue-red identity with energetic motion and a gym-first experience.</p>
              </div>
            </div>
          </div>
          <div className="absolute -left-3 top-10 h-24 w-24 rounded-full bg-sfRed/30 blur-3xl" />
          <div className="absolute -right-3 bottom-12 h-28 w-28 rounded-full bg-sfBlue/30 blur-3xl" />
        </div>
      </div>
    </section>
  );
}