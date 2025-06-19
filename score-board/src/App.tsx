import { useState, useEffect } from "react";
import ScoreBoard from "./lib/ScoreBoard";
import "./App.css";
import type { Match } from "./lib/types";
import { MatchesList, NewGameForm } from "./components";

const scoreBoardInstance = new ScoreBoard();

function App() {
  const [matches, setMatches] = useState<Match[]>(
    scoreBoardInstance.getSummary()
  );
  const [error, setError] = useState<string>("");

  // Use useEffect to subscribe to changes from the ScoreBoard instance
  useEffect(() => {
    // When the scoreboard notifies us of a change, get the latest summary
    const handleScoreBoardChange = () => {
      setMatches(scoreBoardInstance.getSummary());
    };

    // Subscribe to changes
    const unsubscribe = scoreBoardInstance.subscribe(handleScoreBoardChange);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <h1>Football World Cup Score Board</h1>

      <NewGameForm
        scoreBoardInstance={scoreBoardInstance}
        error={error}
        setError={setError}
      />

      <MatchesList
        scoreBoardInstance={scoreBoardInstance}
        matches={matches}
        setError={setError}
      />
    </div>
  );
}

export default App;
