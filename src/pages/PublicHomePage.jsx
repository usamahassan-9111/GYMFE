import { useState } from 'react';
import Hero from '../components/Hero';
import MarqueeBar from '../components/MarqueeBar';
import { useApiResource } from '../hooks/useApiResource';
import SectionCard from '../components/SectionCard';
import ProductInquiryModal from '../components/ProductInquiryModal';
import WhatsAppButton from '../components/WhatsAppButton';

export default function PublicHomePage() {
  const plansResource = useApiResource('/plans');
  const productsResource = useApiResource('/products/active');

  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Ensure data is always an array
  const plans = Array.isArray(plansResource.data) ? plansResource.data : [];
  const products = Array.isArray(productsResource.data) ? productsResource.data : [];

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setShowInquiryModal(true);
  };

  return (
    <div>
      <Hero onExplore={() => document.getElementById('timings')?.scrollIntoView({ behavior: 'smooth' })} />
      <MarqueeBar />

      <section id="timings" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Gym Timings</p>
          <h2 className="mt-3 text-3xl font-black text-white">Walk-in User Information</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition animate-scaleIn">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Boys</p>
              <p className="mt-2 text-xl font-bold text-white">8:00 AM to 10:00 AM</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition animate-scaleIn" style={{ animationDelay: '0.1s' }}>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Girls</p>
              <p className="mt-2 text-xl font-bold text-white">3:00 PM to 5:00 PM</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition animate-scaleIn" style={{ animationDelay: '0.2s' }}>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Boys</p>
              <p className="mt-2 text-xl font-bold text-white">5:30 PM to 1:30 AM</p>
            </div>
          </div>
        </div>
      </section>

      <SectionCard 
        id="plans"
        title="Membership Plans"
        subtitle="Choose the perfect membership plan for your fitness goals"
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.length > 0 ? (
            plans.map((plan, idx) => (
              <div key={plan._id} className="glass rounded-3xl p-6 animate-scaleIn hover:scale-105 transition-transform" style={{ animationDelay: `${idx * 0.1}s` }}>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{plan.name}</p>
                <p className="mt-3 text-3xl font-black text-sfBlue">Rs {plan.price}</p>
                <p className="mt-2 text-sm text-slate-400">{plan.duration}</p>
                <div className="mt-4 rounded-lg bg-sfBlue/10 px-3 py-2">
                  <p className="text-xs text-slate-300">{plan.description || 'Premium membership'}</p>
                </div>
              </div>
            ))
          ) : plansResource.loading ? (
            <div className="col-span-full text-center py-8 text-slate-400">Loading plans...</div>
          ) : (
            <div className="col-span-full text-center py-8 text-slate-400">No plans available</div>
          )}
        </div>
      </SectionCard>

      <SectionCard 
        id="supplements"
        title="Premium Supplements & Products"
        subtitle="High-quality protein powders, vitamins, and fitness supplements"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.length > 0 ? (
            products.map((product, idx) => (
              <div key={product._id} className="glass rounded-3xl overflow-hidden animate-slideIn hover:scale-105 transition-transform group" style={{ animationDelay: `${idx * 0.1}s` }}>
                {product.image && (
                  <div className="relative h-40 w-full bg-gradient-to-br from-sfBlue/20 to-sfRed/20 overflow-hidden">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{product.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{product.category}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2">{product.details || product.description}</p>
                  <div className="mt-4 flex items-center justify-between mb-4">
                    <p className="text-2xl font-black text-sfRed">Rs {product.price}</p>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-sfBlue/20 text-sfBlue">Stock: {product.stock}</span>
                  </div>
                  <button
                    onClick={() => handleBuyClick(product)}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-sfRed to-rose-600 text-white font-semibold hover:shadow-lg hover:shadow-sfRed/50 transition-all"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))
          ) : productsResource.loading ? (
            <div className="col-span-full text-center py-8 text-slate-400">Loading products...</div>
          ) : (
            <div className="col-span-full text-center py-8 text-slate-400">No supplements available yet...</div>
          )}
        </div>
      </SectionCard>

      <section id="trainer" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Certified Guidance</p>
          <h3 className="mt-3 text-3xl font-black text-white">Mr Faisal Certified Gym Trainer</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Structured workout plans for chest day, cardio, weight loss, and muscle gain with dedicated support for beginners and advanced members.
          </p>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <h3 className="text-2xl font-black text-white">Join SF SMART FITNESS</h3>
          <p className="mt-2 text-sm text-slate-300">Visit gym reception for walk-in registration or contact admin for online membership setup.</p>
        </div>
      </section>

      <ProductInquiryModal 
        isOpen={showInquiryModal} 
        product={selectedProduct} 
        onClose={() => {
          setShowInquiryModal(false);
          setSelectedProduct(null);
        }}
      />

      <WhatsAppButton />
    </div>
  );
}