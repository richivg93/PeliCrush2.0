// This file contains utilities for working with Cohere API responses
// The actual API calls are handled in the backend for security

export interface ParsedRecommendation {
  title: string;
  year?: string;
  genre: string;
  description: string;
}

export function parseRecommendations(text: string): ParsedRecommendation[] {
  const lines = text.split('\n').filter(line => line.trim());
  const parsed: ParsedRecommendation[] = [];
  
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
}

export function formatRecommendationForDisplay(recommendation: ParsedRecommendation): string {
  let formatted = `**${recommendation.title}**`;
  if (recommendation.year) {
    formatted += ` (${recommendation.year})`;
  }
  formatted += ` - ${recommendation.genre}\n`;
  if (recommendation.description) {
    formatted += `${recommendation.description}`;
  }
  return formatted;
}
