export type TitleKind = 'movie' | 'series'

export interface Title {
  id: string
  name: string
  tagline: string
  synopsis: string
  kind: TitleKind
  year: number
  rating: string // e.g. PG-13
  runtime: string // "1h 48m" or "3 Seasons"
  match: number // 0-100
  genres: string[]
  cast: string[]
  director: string
  trending: boolean
  newArrival: boolean
  topTen: boolean
  color: string // flat poster background color
  glyph: string // single letter/symbol shown on the card
}
