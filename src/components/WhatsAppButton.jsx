import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const whatsappNumber = "03242952477";

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(
    /^0/,
    "92"
  )}?text=Hi%20SF%20Smart%20Fitness%2C%20I%20am%20interested%20in%20your%20products%20and%20services.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 animate-pulse hover:animate-none group"
      title="Chat with us on WhatsApp"
    >
      <FaWhatsapp className="text-3xl sm:text-4xl" />

      <div className="absolute bottom-full right-0 mb-3 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        📞 {whatsappNumber}
      </div>
    </a>
  );
}