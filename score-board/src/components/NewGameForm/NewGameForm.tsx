import { useState, type Dispatch, type FormEvent } from "react";

import type ScoreBoard from "../../lib/ScoreBoard";

type NewGameFormProps = {
  scoreBoardInstance: ScoreBoard;
  error: string;
  setError: Dispatch<React.SetStateAction<string>>;
  refreshSummary: () => void;
};

export const NewGameForm = ({
  scoreBoardInstance,
  error,
  setError,
  refreshSummary,
}: NewGameFormProps) => {
  const [homeTeam, setHomeTeam] = useState<string>("");
  const [awayTeam, setAwayTeam] = useState<string>("");

  const handleStartGame = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous errors for new game form

    try {
      scoreBoardInstance.startGame({ homeTeam, awayTeam });

      setHomeTeam("");
      setAwayTeam("");

      refreshSummary(); // Update UI
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <form onSubmit={handleStartGame}>
      <h2>Start New Game</h2>

      {error && <p className="error-message">{error}</p>}

      <div>
        <label htmlFor="homeTeam">Home Team:</label>
        <input
          id="homeTeam"
          type="text"
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="awayTeam">Away Team:</label>
        <input
          id="awayTeam"
          type="text"
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
          required
        />
      </div>

      <button type="submit">Start Game</button>
    </form>
  );
};
