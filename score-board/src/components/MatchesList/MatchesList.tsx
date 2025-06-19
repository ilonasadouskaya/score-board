import { useState } from "react";

import { MatchItem } from "./components";
import type { MatchesListProps } from "./types";

export const MatchesList = ({
  scoreBoardInstance,
  matches,
  setError,
}: MatchesListProps) => {
  const [editError, setEditError] = useState<string>("");

  return (
    <>
      <h2>Live Matches</h2>

      {editError && (
        <p className="error-message" style={{ marginBottom: "15px" }}>
          {editError}
        </p>
      )}

      {matches.length === 0 ? (
        <p>No live games currently. Start a new one!</p>
      ) : (
        <ul className="match-list">
          {matches.map((match) => (
            <li key={match.id} className="match-item">
              <MatchItem
                match={match}
                scoreBoardInstance={scoreBoardInstance}
                setEditError={setEditError}
                setError={setError}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
