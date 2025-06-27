import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Star, Play, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: number | null;
  movieTitle: string;
}

export default function MovieModal({ isOpen, onClose, movieId, movieTitle }: MovieModalProps) {
  const { data: movieData, isLoading } = useQuery({
    queryKey: ['/api/movies', movieId],
    queryFn: async () => {
      if (!movieId) return null;
      const response = await apiRequest("GET", `/api/movies/${movieId}`);
      return response.json();
    },
    enabled: !!movieId && isOpen,
  });

  const movie = movieData?.movie;

  const getProvidersByCountry = (providers: any, countryCode: string = 'ES') => {
    return providers?.[countryCode] || {};
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-600">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : movie ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">
                {movie.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Poster */}
              <div className="md:col-span-1">
                <img 
                  src={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/placeholder-poster.jpg'
                  }
                  alt={`${movie.title} poster`}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              {/* Details */}
              <div className="md:col-span-2 space-y-4">
                {/* Basic Info */}
                <div className="flex items-center space-x-4 text-sm">
                  {movie.release_date && (
                    <span className="flex items-center text-gray-300">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  )}
                  {movie.runtime && (
                    <span className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatRuntime(movie.runtime)}
                    </span>
                  )}
                  {movie.vote_average && (
                    <span className="flex items-center text-orange-500">
                      <Star className="w-4 h-4 mr-1" />
                      {movie.vote_average.toFixed(1)}/10
                    </span>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre: any) => (
                      <Badge key={genre.id} variant="secondary" className="bg-orange-500/20 text-orange-500">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Synopsis */}
                <div>
                  <h3 className="font-semibold text-white mb-2">Sinopsis</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {movie.overview || 'No hay sinopsis disponible.'}
                  </p>
                </div>

                {/* Watch Providers */}
                {movie.watch_providers && (
                  <div>
                    <h3 className="font-semibold text-white mb-3">¿Dónde ver?</h3>
                    {(() => {
                      const providers = getProvidersByCountry(movie.watch_providers, 'ES');
                      const flatrate = providers.flatrate || [];
                      const rent = providers.rent || [];
                      const buy = providers.buy || [];

                      return (
                        <div className="space-y-3">
                          {flatrate.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-400 mb-2">Streaming</h4>
                              <div className="flex flex-wrap gap-2">
                                {flatrate.slice(0, 6).map((provider: any) => (
                                  <div key={provider.provider_id} className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2">
                                    <img 
                                      src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                                      alt={provider.provider_name}
                                      className="w-6 h-6 rounded"
                                    />
                                    <span className="text-sm text-white">{provider.provider_name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {rent.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-400 mb-2">Alquilar</h4>
                              <div className="flex flex-wrap gap-2">
                                {rent.slice(0, 4).map((provider: any) => (
                                  <div key={provider.provider_id} className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2">
                                    <img 
                                      src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                                      alt={provider.provider_name}
                                      className="w-6 h-6 rounded"
                                    />
                                    <span className="text-sm text-white">{provider.provider_name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {flatrate.length === 0 && rent.length === 0 && buy.length === 0 && (
                            <p className="text-gray-400 text-sm">
                              No hay información de disponibilidad para España en este momento.
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button 
                    variant="default" 
                    className="gradient-overlay text-black font-semibold"
                    onClick={() => {
                      const searchQuery = encodeURIComponent(`${movie.title} trailer`);
                      window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Ver Trailer
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black"
                    onClick={() => {
                      window.open(`https://www.themoviedb.org/movie/${movie.id}`, '_blank');
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Más Info
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No se pudo cargar la información de la película "{movieTitle}".</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}