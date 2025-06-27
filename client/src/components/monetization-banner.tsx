import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

const ads = [
  {
    id: 1,
    title: "¡Nuevo iPhone 16 Pro disponible!",
    description: "Cámara revolucionaria, chip A18 Pro y batería de larga duración. Desde $999.",
    shortDescription: "Cámara revolucionaria y más.",
    emoji: "📱",
    buttonText: "Ver Ofertas",
    colors: "from-blue-600 to-purple-600",
    buttonColor: "text-blue-600",
    url: "https://apple.com"
  },
  {
    id: 2,
    title: "Netflix - Películas y series ilimitadas",
    description: "Disfruta de miles de películas, series y documentales. Primer mes gratis.",
    shortDescription: "Miles de películas y series.",
    emoji: "🎬",
    buttonText: "Probar Gratis",
    colors: "from-red-600 to-red-500",
    buttonColor: "text-red-600",
    url: "https://netflix.com"
  },
  {
    id: 3,
    title: "Amazon Prime Video - Estrenos exclusivos",
    description: "Ve estrenos exclusivos, series originales y deportes en vivo. Incluye envío Prime.",
    shortDescription: "Estrenos exclusivos y más.",
    emoji: "🏆",
    buttonText: "Suscribirse",
    colors: "from-blue-500 to-blue-600",
    buttonColor: "text-blue-600",
    url: "https://primevideo.com"
  },
  {
    id: 4,
    title: "Spotify Premium - Música sin límites",
    description: "Escucha música sin anuncios, descarga offline y calidad alta. 3 meses por $9.99.",
    shortDescription: "Música sin anuncios.",
    emoji: "🎵",
    buttonText: "Empezar",
    colors: "from-green-600 to-green-500",
    buttonColor: "text-green-600",
    url: "https://spotify.com"
  }
];

export default function MonetizationBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 8000); // Change ad every 8 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const currentAd = ads[currentAdIndex];

  return (
    <div className={`bg-gradient-to-r ${currentAd.colors} text-white px-4 py-3 relative transition-all duration-500`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{currentAd.emoji}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm md:text-base font-medium">
              <span className="font-bold">{currentAd.title}</span>
              <span className="hidden sm:inline"> {currentAd.description}</span>
              <span className="sm:hidden"> {currentAd.shortDescription}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            className={`bg-white ${currentAd.buttonColor} px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center space-x-1`}
            onClick={() => {
              // Simular clic en anuncio
              window.open(currentAd.url, '_blank');
            }}
          >
            <span>{currentAd.buttonText}</span>
            <ExternalLink size={14} />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 transition-colors p-1"
            aria-label="Cerrar anuncio"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      {/* Small indicator dots */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {ads.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentAdIndex ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}