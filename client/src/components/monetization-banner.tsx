import { useState } from "react";
import { X } from "lucide-react";

export default function MonetizationBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-3 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">🎬</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm md:text-base font-medium">
              <span className="font-bold">¡Descubre PeliCrush Premium!</span>
              <span className="hidden sm:inline"> Recomendaciones ilimitadas, sin anuncios y acceso anticipado a estrenos.</span>
              <span className="sm:hidden"> Recomendaciones ilimitadas y más.</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
            onClick={() => {
              // TODO: Implementar lógica de suscripción
              alert('¡Próximamente! La función Premium estará disponible pronto.');
            }}
          >
            Probar Gratis
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 transition-colors p-1"
            aria-label="Cerrar banner"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}