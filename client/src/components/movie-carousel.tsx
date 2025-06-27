import { useState, useEffect } from "react";

const moviePosters = [
  {
    title: "Oppenheimer",
    genre: "Thriller biográfico",
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1200"
  },
  {
    title: "Joker",
    genre: "Drama psicológico",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1200"
  },
  {
    title: "Barbie",
    genre: "Comedia fantástica",
    image: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1200"
  },
  {
    title: "Spider-Man",
    genre: "Acción y aventura",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1200"
  }
];

export default function MovieCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % moviePosters.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const showSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {moviePosters.map((movie, index) => (
              <div key={index} className="relative min-w-full">
                <img 
                  src={movie.image}
                  alt={`${movie.title} movie poster`}
                  className="w-full h-96 md:h-[500px] object-cover rounded-2xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
                  <p className="text-gray-300 mt-1">{movie.genre}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {moviePosters.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-orange-500 opacity-100' 
                    : 'bg-white opacity-50'
                }`}
                onClick={() => showSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
