export type TitleKind = 'movie' | 'series'

export interface Title {
  id: string;
  name: string;
  tagline: string;
  image?: string;
  banner?: string;
  synopsis: string;
  kind: 'movie' | 'series';
  year: number;
  rating: string;
  runtime: string;
  match: number;
  genres: string[];
  cast: string[];
  director: string;
  trending: boolean;
  newArrival: boolean;
  topTen: boolean;
  color: string;
  glyph: string;
  trailer: string; 
}
