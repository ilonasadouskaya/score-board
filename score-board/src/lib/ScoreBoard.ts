import type { Match, MatchId } from "./types";

class ScoreBoard {
  private matches: Map<MatchId, Match> = new Map();
  private nextMatchId: number = 1;

  startGame({ homeTeam, awayTeam }: Pick<Match, "homeTeam" | "awayTeam">) {
    if (homeTeam === awayTeam) {
      throw new Error("Home team and away team cannot be the same.");
    }

    if (this.findMatchByTeamNames({ homeTeam, awayTeam })) {
      throw new Error(
        `A match between ${homeTeam} and ${awayTeam} is already in progress.`
      );
    }

    const { matchId, matchData } = this.createNewMatchData({
      homeTeam,
      awayTeam,
    });
    this.matches.set(matchId, matchData);

    return matchId
  }

  getSummary() {
    return [...this.matches.values()].sort((a, b) => {
      const totalScoreA = a.homeScore + a.awayScore;
      const totalScoreB = b.homeScore + b.awayScore;

      // Primary sort: total score (descending)
      if (totalScoreA !== totalScoreB) {
        return totalScoreB - totalScoreA;
      }

      // Secondary sort: start time (descending - most recent first)
      return b.startedAt - a.startedAt;
    });
  }

  private findMatchByTeamNames({
    homeTeam,
    awayTeam,
  }: Pick<Match, "homeTeam" | "awayTeam">): Match | undefined {
    return [...this.matches.values()].find(
      (match) =>
        (match.homeTeam === homeTeam && match.awayTeam === awayTeam) ||
        (match.homeTeam === awayTeam && match.awayTeam === homeTeam)
    );
  }

  private createNewMatchData({
    homeTeam,
    awayTeam,
  }: Pick<Match, "homeTeam" | "awayTeam">): {
    matchId: MatchId;
    matchData: Match;
  } {
    const matchId: MatchId = `match-${this.nextMatchId++}`;
    const matchData: Match = {
      id: matchId,
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      startedAt: Date.now(),
    };

    return { matchId, matchData };
  }
}

export default ScoreBoard;
