import ScoreBoard from "../ScoreBoard";

const homeTeam = "Poland";
const awayTeam = "Portugal";

describe("Score board", () => {
  let scoreBoard: ScoreBoard;

  beforeEach(() => {
    scoreBoard = new ScoreBoard();

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("startGame", () => {
    it("should start a new game with initial score 0-0", () => {
      const matchId = scoreBoard.startGame({ homeTeam, awayTeam });
      const summary = scoreBoard.getSummary();

      // Verify that new game was added
      expect(summary.length).toBe(1);
      expect(summary[0]).toMatchObject({
        id: matchId,
        homeTeam,
        awayTeam,
        homeScore: 0,
        awayScore: 0,
      });
      // Check that startTime is set
      expect(typeof summary[0].startedAt).toBe("number");
    });

    it("should throw an error when starting a game with the same home and away team", () => {
      const team = "Real Madrid";

      expect(() => {
        scoreBoard.startGame({ homeTeam: team, awayTeam: team });
      }).toThrow("Home team and away team cannot be the same.");

      // Verify that no new game was added
      expect(scoreBoard.getSummary().length).toBe(0);
    });

    it("should throw an error if a game with the exact same home and away teams is already in progress", () => {
      // Start an initial game
      scoreBoard.startGame({ homeTeam, awayTeam });
      expect(scoreBoard.getSummary().length).toBe(1);

      // Attempt to start the exact same game again
      expect(() => {
        scoreBoard.startGame({ homeTeam, awayTeam });
      }).toThrow(
        `A match between ${homeTeam} and ${awayTeam} is already in progress.`
      );

      // Verify that no new game was added
      expect(scoreBoard.getSummary().length).toBe(1);
    });

    it("should throw an error if a game with reversed home and away teams is already in progress", () => {
      // Start an initial game
      scoreBoard.startGame({ homeTeam, awayTeam });
      expect(scoreBoard.getSummary().length).toBe(1);

      // Attempt to start a game with reversed teams
      expect(() => {
        scoreBoard.startGame({ homeTeam: awayTeam, awayTeam: homeTeam });
      }).toThrow(
        `A match between ${awayTeam} and ${homeTeam} is already in progress.`
      ); // Error message should reflect the new input

      // Verify that no new game was added
      expect(scoreBoard.getSummary().length).toBe(1);
      expect(scoreBoard.getSummary()[0].homeTeam).toBe(homeTeam); // Ensure it's still the original game
    });
  });

  describe("finishGame", () => {
    it("should remove a game when finished", () => {
      const matchId1 = scoreBoard.startGame({ homeTeam, awayTeam });
      scoreBoard.startGame({ homeTeam: "Spain", awayTeam: "Brazil" });

      // Verify that 2 new games were added
      expect(scoreBoard.getSummary().length).toBe(2);

      scoreBoard.finishGame({ id: matchId1 });

      const summary = scoreBoard.getSummary();
      // Verify that 1st game was removed
      expect(summary.length).toBe(1);
      expect(summary[0].homeTeam).toBe("Spain");
    });

    it("should throw error if finishing non-existent game", () => {
      const id = "non-existent-id";

      expect(() => scoreBoard.finishGame({ id })).toThrow(
        `Match with ID "${id}" not found.`
      );
    });
  });

  describe("updateScore", () => {
    it("should update the score of an existing game", () => {
      const matchId = scoreBoard.startGame({ homeTeam, awayTeam });
      scoreBoard.updateScore({ id: matchId, homeScore: 2, awayScore: 1 });

      const summary = scoreBoard.getSummary();
      // Verify correct score set
      expect(summary.length).toBe(1);
      expect(summary[0].homeScore).toBe(2);
      expect(summary[0].awayScore).toBe(1);
    });

    it("should throw error if updating score for non-existent game", () => {
      const id = "non-existent-id";

      expect(() =>
        scoreBoard.updateScore({ id, homeScore: 1, awayScore: 0 })
      ).toThrow(`Match with ID "${id}" not found.`);
    });

    it("should throw error if scores are negative", () => {
      const matchId = scoreBoard.startGame({ homeTeam, awayTeam });

      expect(() =>
        scoreBoard.updateScore({ id: matchId, homeScore: -1, awayScore: 0 })
      ).toThrow("Scores must be non-negative numbers.");

      expect(() =>
        scoreBoard.updateScore({ id: matchId, homeScore: 1, awayScore: -5 })
      ).toThrow("Scores must be non-negative numbers.");
    });
  });

  describe("getSummary", () => {
    it("should return summary ordered by total score (descending) and then by most recently added (descending)", () => {
      // Simulate adding games at slightly different times for 'most recently added' check

      // Added earliest, total: 4 (2+2)
      const matchId1 = scoreBoard.startGame({
        homeTeam: "Germany",
        awayTeam: "France",
      });
      scoreBoard.updateScore({ id: matchId1, homeScore: 2, awayScore: 2 });
      vi.advanceTimersByTime(10);

      // Added second, total: 4 (3+1)
      const matchId2 = scoreBoard.startGame({
        homeTeam: "Argentina",
        awayTeam: "Australia",
      });
      scoreBoard.updateScore({ id: matchId2, homeScore: 3, awayScore: 1 });
      vi.advanceTimersByTime(10);

      // Added third, total: 12 (6+6)
      const matchId3 = scoreBoard.startGame({
        homeTeam: "Uruguay",
        awayTeam: "Italy",
      });
      scoreBoard.updateScore({ id: matchId3, homeScore: 6, awayScore: 6 });

      const summary = scoreBoard.getSummary();
      expect(summary.length).toBe(3);

      expect(summary[0].homeTeam).toBe("Uruguay"); // highest total score (12)
      expect(summary[1].homeTeam).toBe("Argentina"); // same score as Germany (4), added 2nd
      expect(summary[2].homeTeam).toBe("Germany"); // same score as Argentina (4), added 1st
    });

    it("should return empty summary if no games are active", () => {
      expect(scoreBoard.getSummary().length).toBe(0);
    });
  });
});
