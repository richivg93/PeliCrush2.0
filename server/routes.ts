import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRecommendationSchema } from "@shared/schema";
import { z } from "zod";

const COHERE_API_KEY = process.env.COHERE_API_KEY || process.env.COHERE_API_KEY_ENV_VAR || "default_key";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function getCohereRecommendations(userQuery: string): Promise<string> {
  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt: `Eres un experto en recomendaciones de películas y series. Basándote en la siguiente descripción del usuario, proporciona exactamente 3 recomendaciones específicas de películas o series. Para cada recomendación incluye: título, género, año aproximado, y una breve descripción de por qué es perfecta para lo que busca el usuario.

Descripción del usuario: "${userQuery}"

Formato de respuesta:
1. [Título] ([Año]) - [Género]
   Descripción: [Breve explicación de por qué encaja con lo que busca]

2. [Título] ([Año]) - [Género]
   Descripción: [Breve explicación de por qué encaja con lo que busca]

3. [Título] ([Año]) - [Género]
   Descripción: [Breve explicación de por qué encaja con lo que busca]`,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status}`);
    }

    const data = await response.json();
    return data.generations[0].text.trim();
  } catch (error) {
    console.error('Error calling Cohere API:', error);
    throw new Error('No se pudieron obtener recomendaciones en este momento. Por favor, inténtalo de nuevo.');
  }
}

async function searchMovieInTMDB(title: string): Promise<any> {
  try {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=es-ES`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results[0] || null;
  } catch (error) {
    console.error('Error searching movie in TMDB:', error);
    return null;
  }
}

async function getMovieDetails(movieId: number): Promise<any> {
  try {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    const [detailsResponse, providersResponse] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=es-ES`),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`)
    ]);

    const details = await detailsResponse.json();
    const providers = await providersResponse.json();

    return {
      ...details,
      watch_providers: providers.results
    };
  } catch (error) {
    console.error('Error getting movie details from TMDB:', error);
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get recommendations from Cohere AI
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { userQuery } = req.body;
      
      if (!userQuery || typeof userQuery !== 'string' || userQuery.trim().length === 0) {
        return res.status(400).json({ message: "La consulta del usuario es requerida" });
      }

      // Get AI recommendations
      const aiResponse = await getCohereRecommendations(userQuery.trim());

      // Store the recommendation
      const recommendation = await storage.createRecommendation({
        userQuery: userQuery.trim(),
        aiResponse,
      });

      res.json({ recommendation: aiResponse });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Error interno del servidor" 
      });
    }
  });

  // Get recent recommendations
  app.get("/api/recommendations/recent", async (req, res) => {
    try {
      const recommendations = await storage.getRecentRecommendations(5);
      res.json({ recommendations });
    } catch (error) {
      console.error('Error getting recent recommendations:', error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Search movie in TMDB
  app.get("/api/movies/search/:title", async (req, res) => {
    try {
      const { title } = req.params;
      const movie = await searchMovieInTMDB(title);
      res.json({ movie });
    } catch (error) {
      console.error('Error searching movie:', error);
      res.status(500).json({ message: "Error buscando película" });
    }
  });

  // Get movie details from TMDB
  app.get("/api/movies/:id", async (req, res) => {
    try {
      const movieId = parseInt(req.params.id);
      const movieDetails = await getMovieDetails(movieId);
      res.json({ movie: movieDetails });
    } catch (error) {
      console.error('Error getting movie details:', error);
      res.status(500).json({ message: "Error obteniendo detalles de película" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
