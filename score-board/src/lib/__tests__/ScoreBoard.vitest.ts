import ScoreBoard from "../ScoreBoard";

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
    const homeTeam = "Poland";
    const awayTeam = "Portugal";

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

  describe("getSummary", () => {
    it("should return summary ordered by total score (descending) and then by most recently added (descending)", () => {
      // Simulate adding games at slightly different times for 'most recently added' check
      scoreBoard.startGame({ homeTeam: "Germany", awayTeam: "France" }); // Added earliest
      vi.advanceTimersByTime(10);

      scoreBoard.startGame({ homeTeam: "Argentina", awayTeam: "Australia" }); // Added second
      vi.advanceTimersByTime(10);

      scoreBoard.startGame({ homeTeam: "Uruguay", awayTeam: "Italy" }); // Added third

      const summary = scoreBoard.getSummary();
      expect(summary.length).toBe(3);

      expect(summary[0].homeTeam).toBe("Uruguay");
      expect(summary[1].homeTeam).toBe("Argentina");
      expect(summary[2].homeTeam).toBe("Germany");
    });

    it("should return empty summary if no games are active", () => {
      expect(scoreBoard.getSummary().length).toBe(0);
    });
  });
});
