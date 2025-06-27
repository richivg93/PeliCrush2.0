import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Tv, Star, Calendar, RotateCcw, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import MovieModal from "./movie-modal";
import InlineAdBanner from "./inline-ad-banner";

interface RecommendationsSectionProps {
  recommendations: string;
  isLoading: boolean;
}

interface ParsedRecommendation {
  title: string;
  year: string;
  genre: string;
  description: string;
}

function MovieRecommendationCard({ 
  rec, 
  onMovieClick 
}: { 
  rec: ParsedRecommendation; 
  onMovieClick: (movie: { id: number; title: string }) => void;
}) {
  const { data: movieData } = useQuery({
    queryKey: ['/api/movies/search', rec.title],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/movies/search/${encodeURIComponent(rec.title)}`);
      return response.json();
    },
    enabled: !!rec.title,
  });

  const movie = movieData?.movie;

  return (
    <Card className="recommendation-card rounded-xl overflow-hidden">
      <div className="flex">
        {/* Movie Poster */}
        <div className="flex-shrink-0 w-24 md:w-32">
          {movie?.poster_path ? (
            <img 
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={`${rec.title} poster`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-orange-500 flex items-center justify-center">
              {rec.genre.toLowerCase().includes('serie') ? (
                <Tv className="text-black text-2xl" />
              ) : (
                <Film className="text-black text-2xl" />
              )}
            </div>
          )}
        </div>

        {/* Movie Details */}
        <div className="flex-1 p-4 md:p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                {rec.title}
              </h3>
              <p className="text-gray-300 mb-3 text-sm md:text-base line-clamp-2">
                {rec.description}
              </p>
              <div className="flex items-center space-x-4 text-sm flex-wrap gap-2">
                <span className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full">
                  {rec.genre}
                </span>
                {rec.year && (
                  <span className="text-gray-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {rec.year}
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Button */}
            {movie && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMovieClick({ id: movie.id, title: rec.title })}
                className="text-orange-500 hover:text-white hover:bg-orange-500/20 ml-4"
              >
                <Info className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function RecommendationsSection({ recommendations, isLoading }: RecommendationsSectionProps) {
  const [selectedMovie, setSelectedMovie] = useState<{ id: number; title: string } | null>(null);

  const parseRecommendations = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const parsed = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.match(/^\d+\./)) {
        const titleMatch = line.match(/^\d+\.\s*(.+?)(?:\s*\((\d{4})\))?\s*-\s*(.+)/);
        if (titleMatch) {
          const title = titleMatch[1];
          const year = titleMatch[2] || '';
          const genre = titleMatch[3];
          
          // Look for description in next lines
          let description = '';
          let j = i + 1;
          while (j < lines.length && !lines[j].match(/^\d+\./)) {
            const descLine = lines[j].trim();
            if (descLine.startsWith('Descripción:')) {
              description = descLine.replace('Descripción:', '').trim();
            } else if (description && descLine) {
              description += ' ' + descLine;
            }
            j++;
          }
          
          parsed.push({ title, year, genre, description });
        }
      }
    }
    
    return parsed;
  };

  const parsedRecommendations = parseRecommendations(recommendations);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <MovieModal 
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        movieId={selectedMovie?.id || null}
        movieTitle={selectedMovie?.title || ''}
      />
      <section className="px-4 py-8" id="recommendationsSection">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            <Star className="inline w-8 h-8 text-orange-500 mr-2" />
            Recomendaciones para ti
          </h2>
          
          <div className="space-y-4">
            {parsedRecommendations.length > 0 ? (
              parsedRecommendations.map((rec, index) => (
                <div key={index}>
                  <MovieRecommendationCard 
                    rec={rec} 
                    onMovieClick={setSelectedMovie} 
                  />
                  {/* Show inline ad after 3rd recommendation */}
                  {index === 2 && <InlineAdBanner />}
                </div>
              ))
            ) : (
              // Fallback display for raw text
              <Card className="recommendation-card rounded-xl p-6">
                <div className="text-gray-300 whitespace-pre-line">
                  {recommendations}
                </div>
              </Card>
            )}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              variant="ghost"
              onClick={scrollToTop}
              className="text-orange-500 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Buscar más recomendaciones
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}