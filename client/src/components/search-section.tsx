import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Wand2 } from "lucide-react";

interface SearchSectionProps {
  onRecommendations: (recommendations: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function SearchSection({ onRecommendations, onLoadingChange }: SearchSectionProps) {
  const [userInput, setUserInput] = useState("");
  const { toast } = useToast();

  const recommendationMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/recommendations", { userQuery: query });
      return response.json();
    },
    onSuccess: (data) => {
      onRecommendations(data.recommendation);
      onLoadingChange(false);
      toast({
        title: "¡Recomendaciones listas!",
        description: "Hemos encontrado películas perfectas para ti.",
      });
    },
    onError: (error) => {
      onLoadingChange(false);
      toast({
        title: "Error",
        description: error.message || "No se pudieron obtener recomendaciones. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) {
      toast({
        title: "Campo requerido",
        description: "Por favor, escribe qué tipo de película o serie buscas",
        variant: "destructive",
      });
      return;
    }

    onLoadingChange(true);
    recommendationMutation.mutate(userInput.trim());
  };

  const isPending = recommendationMutation.isPending;

  return (
    <section className="px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-900 border-gray-600 shadow-2xl">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              ¿Qué te apetece ver hoy?
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Escribe aquí... Por ejemplo: 'Quiero una comedia romántica con final feliz' o 'Busco una serie de suspense con misterio'"
                  className="min-h-[100px] bg-black border-2 border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 resize-none"
                  disabled={isPending}
                />
                <div className="absolute bottom-3 right-3 text-gray-400">
                  <Lightbulb className="w-5 h-5 text-orange-500" />
                </div>
              </div>
              
              <Button 
                type="submit"
                disabled={isPending || !userInput.trim()}
                className={`w-full gradient-overlay text-black font-semibold py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg ${
                  userInput.trim() ? 'pulse-animation' : ''
                }`}
              >
                {isPending ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Recomiéndame algo
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-gray-400 text-sm">
              🤖 Impulsado por inteligencia artificial
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
