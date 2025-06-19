import type { Listener, Match } from "../lib/types";

export const mockMatches: Match[] = [];

export const mockScoreBoard = {
  _listeners: [] as Listener[],

  subscribe(callback: Listener) {
    this._listeners.push(callback);

    return () => {
      this._listeners = this._listeners.filter((cb) => cb !== callback);
    };
  },

  _notifyListeners() {
    this._listeners.forEach((cb) => cb());
  },

  startGame: vi.fn((home, away) => {
    if (home === "" || away === "") throw new Error("Team names required");

    if (home === away) throw new Error("Same teams");

    const newMatch: Match = {
      id: `mock-${Date.now()}`,
      homeTeam: home,
      awayTeam: away,
      homeScore: 0,
      awayScore: 0,
      startedAt: Date.now(),
    };
    mockMatches.push(newMatch);

    mockScoreBoard._notifyListeners()

    return newMatch.id;
  }),

  finishGame: vi.fn((id) => {
    const index = mockMatches.findIndex((m) => m.id === id);

    if (index === -1) throw new Error("Match not found");

    mockMatches.splice(index, 1);

    mockScoreBoard._notifyListeners()
  }),

  updateScore: vi.fn((id, home, away) => {
    if (home < 0 || away < 0) throw new Error("Scores must be non-negative");

    const match = mockMatches.find((m) => m.id === id);

    if (!match) throw new Error("Match not found");

    match.homeScore = home;
    match.awayScore = away;

    mockScoreBoard._notifyListeners()
  }),

  getSummary: vi.fn(() => {
    return [...mockMatches].sort((a, b) => {
      const totalScoreA = a.homeScore + a.awayScore;
      const totalScoreB = b.homeScore + b.awayScore;
      if (totalScoreA !== totalScoreB) {
        return totalScoreB - totalScoreA;
      }
      return b.startedAt - a.startedAt;
    });
  }),
};
