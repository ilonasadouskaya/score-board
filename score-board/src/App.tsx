import { useState, useEffect, useCallback } from "react";
import ScoreBoard from "./lib/ScoreBoard";
import "./App.css";
import type { Match } from "./lib/types";
import { MatchesList, NewGameForm } from "./components";

const scoreBoardInstance = new ScoreBoard();

function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string>("");

  // Function to refresh the summary and update React state
  const refreshSummary = useCallback(() => {
    setMatches(scoreBoardInstance.getSummary());
  }, []);

  // Initial load of summary
  useEffect(() => {
    refreshSummary();
  }, [refreshSummary]);

  return (
    <div className="App">
      <h1>Football World Cup Score Board</h1>

      <NewGameForm
        scoreBoardInstance={scoreBoardInstance}
        error={error}
        setError={setError}
        refreshSummary={refreshSummary}
      />

      <MatchesList
        scoreBoardInstance={scoreBoardInstance}
        matches={matches}
        setError={setError}
        refreshSummary={refreshSummary}
      />
    </div>
  );
}

export default App;
