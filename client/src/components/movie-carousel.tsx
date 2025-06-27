import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TrendingMovie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
}

export default function MovieCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch trending movies from TMDB
  const { data: moviesData, isLoading } = useQuery({
    queryKey: ['/api/movies/trending/now'],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/movies/trending/now`);
      return response.json();
    },
  });

  const movies = moviesData?.movies || [];

  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % movies.length);
      }, 4000); // Slightly longer interval for reading

      return () => clearInterval(interval);
    }
  }, [movies.length]);

  const showSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Genre mapping (basic ones)
  const getGenreText = (genreIds: number[]) => {
    const genreMap: { [key: number]: string } = {
      28: "Acción",
      12: "Aventura", 
      16: "Animación",
      35: "Comedia",
      80: "Crimen",
      99: "Documental",
      18: "Drama",
      10751: "Familia",
      14: "Fantasía",
      36: "Historia",
      27: "Terror",
      10402: "Música",
      9648: "Misterio",
      10749: "Romance",
      878: "Ciencia ficción",
      10770: "Película para TV",
      53: "Suspense",
      10752: "Guerra",
      37: "Western"
    };

    const genres = genreIds.slice(0, 2).map(id => genreMap[id]).filter(Boolean);
    return genres.length > 0 ? genres.join(", ") : "Película";
  };

  if (isLoading) {
    return (
      <section className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <div className="movie-poster-skeleton w-full h-96 md:h-[500px] rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!movies.length) {
    return null;
  }

  return (
    <section className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {movies.map((movie: TrendingMovie, index: number) => (
              <div key={movie.id} className="relative min-w-full">
                <img 
                  src={movie.backdrop_path 
                    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                    : `https://image.tmdb.org/t/p/w780${movie.poster_path}`
                  }
                  alt={`${movie.title} backdrop`}
                  className="w-full h-96 md:h-[500px] object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                  <div className="max-w-2xl">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {movie.title}
                    </h3>
                    <p className="text-orange-400 text-sm font-medium mb-2">
                      {getGenreText(movie.genre_ids)}
                    </p>
                    {movie.overview && (
                      <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-3">
                        {movie.overview}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-400">
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                      <span className="flex items-center text-orange-500">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {movies.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-orange-500 opacity-100' 
                    : 'bg-white opacity-50'
                }`}
                onClick={() => showSlide(index)}
                aria-label={`Ir a película ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => showSlide(currentSlide === 0 ? movies.length - 1 : currentSlide - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
            aria-label="Película anterior"
          >
            ←
          </button>
          <button
            onClick={() => showSlide((currentSlide + 1) % movies.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
            aria-label="Siguiente película"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
