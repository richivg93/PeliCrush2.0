import { useState } from "react";
import Logo from "@/components/logo";
import MovieCarousel from "@/components/movie-carousel";
import SearchSection from "@/components/search-section";
import RecommendationsSection from "@/components/recommendations-section";

export default function Home() {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRecommendations = (recs: string) => {
    setRecommendations(recs);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center space-x-3">
            <Logo />
            <h1 className="text-4xl md:text-5xl font-bold">
              PeliCrush <span className="text-2xl md:text-3xl">🍿</span>
            </h1>
          </div>
          <p className="text-center text-gray-400 mt-2 text-lg">
            Descubre tu próxima película favorita
          </p>
        </div>
      </header>

      {/* Movie Carousel */}
      <MovieCarousel />

      {/* Search Section */}
      <SearchSection 
        onRecommendations={handleRecommendations}
        onLoadingChange={handleLoadingChange}
      />

      {/* Recommendations Section */}
      {recommendations && (
        <RecommendationsSection 
          recommendations={recommendations}
          isLoading={isLoading}
        />
      )}

      {/* Footer */}
      <footer className="px-4 py-8 mt-12 border-t border-gray-600">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Logo size="sm" />
              <span className="text-xl font-bold">PeliCrush</span>
            </div>
            
            <p className="text-gray-400 mb-4">
              Descubre películas y series perfectas para ti con inteligencia artificial
            </p>
            
            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fab fa-tiktok text-xl"></i>
              </a>
            </div>
            
            {/* Future features preview */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3 text-orange-500">
                🚀 Próximamente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-orange-500">👤</span>
                  <span className="text-gray-300">Registro y perfiles personalizados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-orange-500">❤️</span>
                  <span className="text-gray-300">Lista de favoritos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-orange-500">👥</span>
                  <span className="text-gray-300">Recomendaciones sociales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-orange-500">📱</span>
                  <span className="text-gray-300">App móvil nativa</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2024 PeliCrush. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
