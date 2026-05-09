export default function SectionCard({ title, subtitle, children, id, icon: Icon }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="mb-6 flex items-start gap-4">
        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sfBlue/20 to-sfRed/20 border border-white/10">
            <Icon className="h-6 w-6 text-sfBlue" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="section-title">{title}</h3>
          <p className="section-subtitle">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}