export type MatchId = string;

export type Match = {
  id: MatchId;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  startedAt: number;
};

export type Listener = () => void;
