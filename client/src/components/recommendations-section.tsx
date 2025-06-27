import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Film, Tv, Star, Clock, Calendar, RotateCcw } from "lucide-react";

interface RecommendationsSectionProps {
  recommendations: string;
  isLoading: boolean;
}

export default function RecommendationsSection({ recommendations, isLoading }: RecommendationsSectionProps) {
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
    <section className="px-4 py-8" id="recommendationsSection">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          <Star className="inline w-8 h-8 text-orange-500 mr-2" />
          Recomendaciones para ti
        </h2>
        
        <div className="space-y-4">
          {parsedRecommendations.length > 0 ? (
            parsedRecommendations.map((rec, index) => (
              <Card key={index} className="recommendation-card rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
                    {rec.genre.toLowerCase().includes('serie') ? (
                      <Tv className="text-black text-2xl" />
                    ) : (
                      <Film className="text-black text-2xl" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {rec.title}
                    </h3>
                    <p className="text-gray-300 mb-3">
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
                </div>
              </Card>
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
  );
}
