import { Sparkles, Star } from "lucide-react";

export default function InlineAdBanner() {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 rounded-xl p-6 my-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-600/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="text-orange-500" size={20} />
          <span className="text-orange-500 font-semibold text-sm">PREMIUM</span>
        </div>
        
        <h3 className="text-white text-xl font-bold mb-2">
          ¿Te gustaron estas recomendaciones?
        </h3>
        
        <p className="text-gray-300 text-sm mb-4">
          Obtén recomendaciones más precisas y personalizadas con nuestro algoritmo de IA avanzado.
        </p>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-orange-400">
              <Star size={16} className="fill-current" />
              <span>Recomendaciones ilimitadas</span>
            </div>
            <div className="flex items-center space-x-1 text-orange-400">
              <Star size={16} className="fill-current" />
              <span>Sin anuncios</span>
            </div>
          </div>
          
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors shadow-lg"
            onClick={() => {
              // TODO: Implementar lógica de suscripción
              alert('¡Próximamente! La función Premium estará disponible pronto.');
            }}
          >
            Probar 7 días gratis
          </button>
        </div>
      </div>
    </div>
  );
}