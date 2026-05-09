export default function MarqueeBar() {
  const text = 'Boys timing 8 to 10 AM | Girls timing 3 to 5 PM | Boys timing 5:30 to 1:30 AM | Monthly fee 2500 | Personal trainer fee 5000 | Cardio area fee 2000 | Fully air-conditioned gym | New machines available';

  return (
    <div className="overflow-hidden border-y border-white/10 bg-sfBlue/20 text-white">
      <div className="flex w-[200%] animate-marquee gap-8 py-3 text-sm font-medium uppercase tracking-[0.18em] sm:text-base">
        <div className="flex min-w-1/2 gap-8 whitespace-nowrap">
          <span>{text}</span>
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
}