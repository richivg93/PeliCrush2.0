import { useState, useEffect } from "react";
import { X, Zap, Heart } from "lucide-react";

export default function FloatingCTABanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show banner after 30 seconds of page load
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-2xl p-5 relative animate-in slide-in-from-bottom-2 duration-500">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
        
        <div className="pr-6">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="text-white" size={20} />
            <span className="font-bold text-sm">¡Mejora tu experiencia!</span>
          </div>
          
          <h4 className="font-bold text-lg mb-1">
            ¿Te está gustando PeliCrush?
          </h4>
          
          <p className="text-white/90 text-sm mb-4">
            Desbloquea recomendaciones ilimitadas y descubre tu próxima película favorita.
          </p>
          
          <div className="flex flex-col space-y-2">
            <button
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors shadow-sm"
              onClick={() => {
                alert('¡Próximamente! La función Premium estará disponible pronto.');
              }}
            >
              Probar Premium
            </button>
            
            <button
              onClick={handleDismiss}
              className="text-white/80 text-xs hover:text-white transition-colors"
            >
              Tal vez más tarde
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white/20 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white/10 rounded-full"></div>
      </div>
    </div>
  );
}